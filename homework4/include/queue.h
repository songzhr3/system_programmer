/*!Copyright(c) 2008-2020 Shenzhen TP-LINK Technologies Co.Ltd.
 *
 *\file    queue.h
 *\brief   The head file of queue.c
 *
 *\author  Song Zhanren
 *\version 1.0.0
 *\date	   17Aug20
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
# include<stdio.h>
#include "../include/DListNode.h"
/**************************************************************************************************/
/*                                          DEFINES                                               */
/**************************************************************************************************/
#ifndef __QUEUE_H__
#define __QUEUE_H__

#ifdef __cplusplus
extern "C"{
#endif /* _cplusplus */

/**************************************************************************************************/
/*                                          TYPES                                                 */
/**************************************************************************************************/
struct _Queue;
typedef struct _Queue Queue;

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

// 可供调用的队列基本操作函数
Queue* queue_create(DListDataDestroyFunc data_destroy, void* ctx);
DListRet queue_head(Queue* thiz, void** data);
DListRet queue_push(Queue* thiz, void* data);
DListRet queue_pop(Queue* thiz);
DListRet queue_foreach(Queue* thiz, DListDataVisitFunc visit, void* ctx);
size_t queue_length(Queue* thiz);
void queue_destroy(Queue** thiz);

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/

#ifdef __cplusplus
}
#endif /* _cplusplus */

#endif/*__QUEUE_H__*/