/*!Copyright(c) 2008-2020 Shenzhen TP-LINK Technologies Co.Ltd.
 *
 *\file    memory_manager.c
 *\brief   The implementation of memory manager
 *\details
 *
 *\author  Song Zhanren
 *\version 1.0.0
 *\date    20Aug20
 *
 *\warning
 *
 *\history \
 *
 *
 */
/**************************************************************************************************/
/*                                          CONFIGURATIONS                                        */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          INCLUDE_FILES                                         */
/**************************************************************************************************/
#include <stdlib.h>
#include <string.h>
#include "../include/memory_manager.h"
/**************************************************************************************************/
/*                                          DEFINES                                               */
/**************************************************************************************************/
#define MIN_SIZE sizeof(DListNode)
#define REAL_NEED_SZIE(size) ((size > sizeof(DListNode)? size : MIN_SIZE) + sizeof(size_t))

/**************************************************************************************************/
/*                                          TYPES                                                 */
/**************************************************************************************************/
typedef struct _DListNode
{
	size_t length;
	struct _DListNode* prev;
	struct _DListNode* next;
}DListNode;

typedef struct _PrivInfo
{
	DListNode* dlist;
}PrivInfo;


/**************************************************************************************************/
/*                                          EXTERN_PROTOTYPES                                     */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          LOCAL_PROTOTYPES                                      */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          VARIABLES                                             */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          LOCAL_FUNCTIONS                                       */
/**************************************************************************************************/

void* memory_manager_alloc(Memory_Manager* thiz, size_t size)
{
	return_val_if_fail(NULL != thiz && NULL != thiz->alloc, NULL);

	return thiz->alloc(thiz, size);
}

void memory_manager_free(Memory_Manager* thiz, void* ptr)
{
	return_if_fail(NULL != thiz && NULL != thiz->free);

	thiz->free(thiz, ptr);

	return;
}

void memory_manager_destroy(Memory_Manager* thiz)
{
	return_if_fail(NULL != thiz && NULL != thiz->destroy);

	return thiz->destroy(thiz);
}

static void* _memory_manager_alloc(Memory_Manager* thiz, size_t size)
{
	DListNode* iter = NULL;
	size_t length = REAL_NEED_SZIE(size);
	PrivInfo* priv = (PrivInfo*)thiz->priv;

	for(iter = priv->dlist; NULL != iter; iter = iter->next)
	{
		if (iter->length > length)
		{
			break;
		}
	}

	return_val_if_fail(NULL != iter, NULL);

	if (iter->length < (length + MIN_SIZE))
	{
		if (priv->dlist == iter)
		{
			priv->dlist = iter->next;
		}

		if (NULL != iter->prev)
		{
			iter->prev->next = iter->next;
		}

		if (NULL != iter->next)
		{
			iter->next->prev = iter->prev;
		}
	}
	else
	{
		DListNode* newIter = (DListNode*)((char*)iter + length);

		newIter->length = iter->length - length;
		newIter->next = iter->next;
		newIter->prev = iter->prev;

		if (NULL != iter->prev)
		{
			iter->prev->next = newIter;
		}

		if (NULL != iter->next)
		{
			iter->next->prev = newIter;
		}

		if (priv->dlist == iter)
		{
			priv->dlist = newIter;
		}

		iter->length = length;
	}

	return (char*)iter + sizeof(size_t);
}

static void _memory_manager_merge_prev_next(Memory_Manager* thiz, DListNode* prev, DListNode* next)
{
	PrivInfo* priv = (PrivInfo*)thiz->priv;
	return_if_fail(NULL != prev && NULL != next && prev->next == next);

	prev->next = next->next;
	if (NULL != next->next)
	{
		next->next->prev = prev;
	}

	prev->length += next->length;

	if (priv->dlist == next)
	{
		priv->dlist = prev;
	}

	return;
}

static void _memory_manager_merge_dlist(Memory_Manager* thiz, DListNode* iter)
{
	DListNode* prevNode = iter->prev;
	DListNode* nextNode = iter->next;

	return_if_fail(NULL != thiz && NULL != iter);

	if (NULL != prevNode && ((size_t)prevNode + prevNode->length) == (size_t)iter)
	{
		_memory_manager_merge_prev_next(thiz, prevNode, nextNode);
	}

	if (NULL != nextNode && ((size_t)iter + iter->length) == (size_t)nextNode)
	{
		_memory_manager_merge_prev_next(thiz, iter, nextNode);
	}

	return;
}

static void _memory_manager_free(Memory_Manager* thiz, void* ptr)
{
	DListNode* iter = NULL;
	DListNode* needIter = NULL;
	PrivInfo* priv = (PrivInfo*)thiz->priv;

	return_if_fail(NULL != ptr);

	needIter = (DListNode*)((char*)ptr - sizeof(size_t));

	needIter->prev = NULL;
	needIter->next = NULL;

	if (NULL == priv->dlist)
	{
		priv->dlist = needIter;

		return;
	}

	for (iter = priv->dlist; NULL != iter; iter = iter->next)
	{
		if ((size_t)iter > (size_t)needIter)
		{
			needIter->next = iter;
			needIter->prev = iter->prev;

			if (NULL != iter->prev)
			{
				iter->prev->next = needIter;
			}

			iter->prev = needIter;

			if (priv->dlist == iter)
			{
				priv->dlist = needIter;
			}

			break;
		}
		if (NULL == iter->next)
		{
			iter->next = needIter;
			needIter->prev = iter;

			break;
		}
	}

	_memory_manager_merge_dlist(thiz, needIter);

	return ;
}

static void _memory_manager_destroy(Memory_Manager* thiz)
{
	if (NULL != thiz)
	{
		PrivInfo* priv = (PrivInfo*)thiz->priv;
		priv->dlist = NULL;

		SAFE_FREE(thiz);
	}

	return;
}


Memory_Manager* memory_manager_create(void* buffer, size_t length)
{
	Memory_Manager* thiz = NULL;

	return_val_if_fail(NULL != buffer && length > MIN_SIZE, NULL);

	thiz = (Memory_Manager*)calloc(1, sizeof(Memory_Manager) + sizeof(PrivInfo));

	if (NULL != thiz)
	{
		PrivInfo* priv = (PrivInfo*)thiz->priv;

		thiz->alloc = _memory_manager_alloc;
		thiz->free = _memory_manager_free;
		thiz->destroy = _memory_manager_destroy;

		priv->dlist = (DListNode*)buffer;
		priv->dlist->prev = NULL;
		priv->dlist->next = NULL;
		priv->dlist->length = length;
	}

	return thiz;
}
/**************************************************************************************************/
/*                                          PUBLIC_FUNCTIONS                                      */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/

#include <assert.h>
// #include "../include/memory_manager.h"

static void memory_manager_print(Memory_Manager* thiz)
{
	int index = 0;
	DListNode* iter = NULL;
	PrivInfo* priv = (PrivInfo*)thiz->priv;

	return_if_fail(NULL != thiz);

	for (iter = priv->dlist; NULL != iter; iter = iter->next, index++)
	{
		printf("[%d] %p %ld\n", index, iter, iter->length);
	}

	return;
}

int main()
{
	char buffer[1024];
	char* ptrs[5] = {0};
	int i = 0;

	Memory_Manager* memory_manager = memory_manager_create(buffer, sizeof(buffer));

	char* ptr = memory_manager_alloc(memory_manager, 100);
	memory_manager_free(memory_manager, ptr);
	memory_manager_print(memory_manager);
	printf("\n");

	// for (i = 0; i < sizeof(ptrs) / sizeof(ptrs[0]); i++)
	// {
	// 	ptrs[i] = memory_manager_alloc(memory_manager, 100 * (i+1));
	// 	memory_manager_print(memory_manager);
	// }

	// printf("\n");

	// for (i = 0; i < sizeof(ptrs) / sizeof(ptrs[0]); i++)
	// {
	// 	memory_manager_free(memory_manager, ptrs[i]);
	// 	ptrs[i] = NULL;
	// 	memory_manager_print(memory_manager);
	// }

	// printf("\n");
	// memory_manager_print(memory_manager);

	ptr = memory_manager_alloc(memory_manager, 200);
	memory_manager_free(memory_manager, ptr);
	memory_manager_print(memory_manager);
	printf("\n");

	ptr = memory_manager_alloc(memory_manager, 300);
	memory_manager_free(memory_manager, ptr);
	memory_manager_print(memory_manager);
	printf("\n");

	ptr = memory_manager_alloc(memory_manager, 110);
	memory_manager_print(memory_manager);
	printf("#########\n");
	memory_manager_free(memory_manager, ptr);
	memory_manager_print(memory_manager);
	printf("\n");

	ptr = memory_manager_alloc(memory_manager, 350);
	memory_manager_print(memory_manager);
	printf("#########\n");
	memory_manager_free(memory_manager, ptr);
	memory_manager_print(memory_manager);
	printf("\n");

	getchar();
	return 0;
}

