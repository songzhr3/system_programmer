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
typedef struct _PrivInfo
{
	DListNode* dlist;          /* 指向空闲链表的第一个节点*/
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

/* 
* fisrt-fit算法内部内存分配函数
*/
static void* _memory_manager_alloc(Memory_Manager* thiz, size_t size)
{
	DListNode* iter = NULL;
	size_t length = REAL_NEED_SZIE(size);

	return_val_if_fail(NULL != thiz, NULL);

	/* 
	* 遍历查找空闲链表，直到找到内存块大小大于所需内存
	*/
	PrivInfo* priv = (PrivInfo*)thiz->priv;
	for(iter = priv->dlist; NULL != iter; iter = iter->next)
	{
		if (iter->length > length)
		{
			break;
		}
	}

	/* 
	* 如若没有可以分配的内存，返回NULL
	*/
	return_val_if_fail(NULL != iter, NULL);

	/* 
	* 从空闲链表中摘除合适的空闲内存块
	*/
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

	/* 
	* 空闲内存块过大，对内存块进行切块，一块分配给用户，剩下的插入链表中
	*/
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

	/* 
	*  sizeof(size_t)用于保存内存块大小
	*/
	return (char*)iter + sizeof(size_t);
}

/* 
* 相邻两块内存合并函数
*/
static void _memory_manager_merge_prev_next(Memory_Manager* thiz, DListNode* prev, DListNode* next)
{
	PrivInfo* priv = (PrivInfo*)thiz->priv;

	/* 
	* 前一块内存起始地址加上内存长度刚好等于后一块内存的起始气质
	* 内存块相邻可以合并，调用相邻两块内存合并函数
	*/
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

/* 
* 整个链表内存合并函数
*/
static void _memory_manager_merge_dlist(Memory_Manager* thiz, DListNode* iter)
{
	DListNode* prevNode = iter->prev;
	DListNode* nextNode = iter->next;

	return_if_fail(NULL != thiz && NULL != iter);

	if (NULL != prevNode && ((size_t)prevNode + prevNode->length) == (size_t)iter)
	{
		/* 
		* 尝试合并当前内存块与前一个内存块
		*/
		_memory_manager_merge_prev_next(thiz, prevNode, nextNode);

		/* 
		* 递归合并相邻的两块内存
		*/
		_memory_manager_merge_dlist(thiz, prevNode);
	}

	if (NULL != nextNode && ((size_t)iter + iter->length) == (size_t)nextNode)
	{
		/* 
		* 尝试合并当前内存块与后一个内存块
		*/
		_memory_manager_merge_prev_next(thiz, iter, nextNode);
		_memory_manager_merge_dlist(thiz, nextNode);
	}

	return;
}

/* 
* 内部内存释放函数
*/
static void _memory_manager_free(Memory_Manager* thiz, void* ptr)
{
	DListNode* iter = NULL;
	DListNode* needIter = NULL;
	PrivInfo* priv = (PrivInfo*)thiz->priv;

	return_if_fail(NULL != ptr);

	needIter = (DListNode*)((char*)ptr - sizeof(size_t));
	needIter->prev = NULL;
	needIter->next = NULL;

	/* 
	* 空闲链表为空，直接把空闲内存块插入第一个位置
	*/
	if (NULL == priv->dlist)
	{
		priv->dlist = needIter;

		return;
	}

	/* 
	* 把释放的内存块根据起始位置插入到空闲链表中的合适位置
	*/
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

		/* 
		* 插入在链表的最后位置
		*/
		if (NULL == iter->next)
		{
			iter->next = needIter;
			needIter->prev = iter;

			break;
		}
	}

	/* 
	* 对空闲链表的内存块进行合并
	*/
	_memory_manager_merge_dlist(thiz, needIter);

	return ;
}

/* 
* 内存分配器销毁函数
*/
static void _memory_manager_destroy(Memory_Manager** thiz)
{
	if (NULL == thiz || NULL == *thiz)
	{
		return;
	}

	/* 
	* 释放内存管理器的空间，同时把空闲链表置为NULL
	* 用于创建内存管理器的内存不是malloc而来的堆内存
	*/
	else
	{
		PrivInfo* priv = (PrivInfo*)(*thiz)->priv;
		priv->dlist = NULL;

		SAFE_FREE(*thiz);
	}

	return;
}

/**************************************************************************************************/
/*                                          PUBLIC_FUNCTIONS                                      */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/

/* 
* 内存管理器创建函数
*/
Memory_Manager* memory_manager_create(void* buffer, size_t length)
{
	Memory_Manager* thiz = NULL;

	return_val_if_fail(NULL != buffer && length > MIN_SIZE, NULL);

	/* 
	* 为内存管理器和空闲链表开辟空间
	*/
	thiz = (Memory_Manager*)calloc(1, sizeof(Memory_Manager) + sizeof(PrivInfo));

	/* 
	* 初始化内存管理器对外接口以及空闲链表
	*/
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

/* 
* 外部内存分配接口，调用内部内存分配函数
*/
void* memory_manager_alloc(Memory_Manager* thiz, size_t size)
{
	return_val_if_fail(NULL != thiz && NULL != thiz->alloc, NULL);

	return thiz->alloc(thiz, size);
}

/* 
* 外部内存释放接口，调用内部内存释放函数
*/
void memory_manager_free(Memory_Manager* thiz, void* ptr)
{
	return_if_fail(NULL != thiz && NULL != thiz->free);

	thiz->free(thiz, ptr);

	return;
}

/* 
* 外部内存管理器销毁接口，调用内部内存管理器销毁函数
*/
void memory_manager_destroy(Memory_Manager** thiz)
{
	return_if_fail(NULL != (*thiz) && NULL != (*thiz)->destroy);

	return (*thiz)->destroy(thiz);
}

/* 
* 使用宏控制 内存管理器的测试
*/
#ifdef TEST_MEMORY_MANAGER_FIRSTFIT

#include <assert.h>

/* 
* 打印内存管理器中空闲链表中的空闲内存块编号、起始地址以及内存大小
*/
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

/* 
* 主函数
*/
int main()
{
	char buffer[1024];

	Memory_Manager* memory_manager = memory_manager_create(buffer, sizeof(buffer));

	char* ptr = memory_manager_alloc(memory_manager, 5);
	memory_manager_free(memory_manager, ptr);
	memory_manager_print(memory_manager);
	printf("\n");

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

#endif 