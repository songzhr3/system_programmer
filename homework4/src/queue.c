/*!Copyright(c) 2008-2020 Shenzhen TP-LINK Technologies Co.Ltd.
 *
 *\file    queue.c
 *\brief   The implementation of queue
 *\details
 *
 *\author  Song Zhanren
 *\version 1.0.0
 *\date    18Aug20
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
#include "../include/queue.h"
#include "../include/DListNode.h"
/**************************************************************************************************/
/*                                          DEFINES                                               */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          TYPES                                                 */
/**************************************************************************************************/

// queue define
struct _Queue
{
	DList* dlist;
};

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

/**************************************************************************************************/
/*                                          PUBLIC_FUNCTIONS                                      */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/

// queue create funtion
Queue* queue_create(DListDataDestroyFunc data_destroy, void* ctx)
{
	Queue* thiz = (Queue*)malloc(sizeof(Queue));

	if(thiz != NULL)
	{
		if(NULL == (thiz->dlist = dlist_create(data_destroy, ctx, NULL)))
		{
			free(thiz);
			thiz = NULL;
		}
	}

	return thiz;
}

// get the head element of queue
DListRet queue_head(Queue* thiz, void** data)
{
	return_val_if_fail(thiz != NULL && data != NULL, DLIST_RET_PARAMS);

	return dlist_get_by_index(thiz->dlist, 0, data);
}

// queue push funtion
DListRet queue_push(Queue* thiz, void* data)
{
	return_val_if_fail(thiz != NULL, DLIST_RET_PARAMS);

	return dlist_append(thiz->dlist, data);
}

// queue pop funtion
DListRet queue_pop(Queue* thiz)
{
	return_val_if_fail(thiz != NULL, DLIST_RET_PARAMS);

	return dlist_delete(thiz->dlist, 0);
}

// get the length of queue
size_t queue_length(Queue* thiz)
{
	return_val_if_fail(thiz != NULL, 0);

	return dlist_length(thiz->dlist);	
}

// queue foreach funtion
DListRet queue_foreach(Queue* thiz, DListDataVisitFunc visit, void* ctx)
{
	return_val_if_fail(thiz != NULL && visit != NULL, DLIST_RET_PARAMS);

	return dlist_foreach(thiz->dlist, visit, ctx);
}

// queue destroy funtion
void queue_destroy(Queue** thiz)
{
	if (NULL == thiz || NULL == *thiz)
	{
		return;
	}

	else
	{
		dlist_destroy((*thiz)->dlist);
		SAFE_FREE(*thiz);
	}

	return;
}