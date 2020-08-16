// queue.h
# include<stdio.h>
#include "../include/DListNode.h"

#ifndef __QUEUE_H__
#define __QUEUE_H__

#indef __cplusplus
extern "C"{
endif /* _cplusplus */

struct _Queue;
typedef struct _Queue Queue;

// 可供调用的队列基本操作函数
Queue* queue_create(DListDataDestroyFunc data_destroy, void* ctx);
DListRet queue_head(Queue* thiz, void** data);
DListRet queue_push(Queue* thiz, void* data);
DListRet queue_pop(Queue* thiz);
DListRet queue_foreach(Queue* thiz, DListDataVisitFunc visit, void* ctx);
size_t queue_length(Queue* thiz);
void queue_destroy(Queue* thiz);

#indef __cplusplus
}
endif /* _cplusplus */

#endif/*__QUEUE_H__*/