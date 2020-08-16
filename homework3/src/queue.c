// queue.c
#include "../include/queue.h"
#include "../include/DListNode.h"

struct _Queue
{
	DList* dlist;
};

Queue* queue_create(DListDataDestroyFunc data_destroy, void* ctx)
{
	Queue* thiz = (Queue*)malloc(sizeof(Queue));

	if(thiz != NULL)
	{
		if((thiz->dlist = dlist_create(data_destroy, ctx, NULL)) == NULL)
		{
			free(thiz);
			thiz = NULL;
		}
	}

	return thiz;
}

DListRet queue_head(Queue* thiz, void** data)
{
	return_val_if_fail(thiz != NULL && data != NULL, DLIST_RET_PARAMS);

	return dlist_get_by_index(thiz->dlist, 0, data);
}

DListRet queue_push(Queue* thiz, void* data)
{
	return_val_if_fail(thiz != NULL, DLIST_RET_PARAMS);

	return dlist_append(thiz->dlist, data);
}

DListRet queue_pop(Queue* thiz)
{
	return_val_if_fail(thiz != NULL, DLIST_RET_PARAMS);

	return dlist_delete(thiz->dlist, 0);
}

size_t queue_length(Queue* thiz)
{
	return_val_if_fail(thiz != NULL, 0);

	return dlist_length(thiz->dlist);	
}

DListRet queue_foreach(Queue* thiz, DListDataVisitFunc visit, void* ctx)
{
	return_val_if_fail(thiz != NULL && visit != NULL, DLIST_RET_PARAMS);

	return dlist_foreach(thiz->dlist, visit, ctx);
}

void queue_destroy(Queue* thiz)
{
	if(thiz != NULL)
	{
		dlist_destroy(thiz->dlist);
		thiz->dlist = NULL;

		free(thiz);
	}

	return;
}
