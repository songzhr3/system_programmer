/*!Copyright(c) 2008-2020 Shenzhen TP-LINK Technologies Co.Ltd.
 *
 *\file    DListNode.h
 *\brief   The head file of DListNode.c
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
#include <stdlib.h>
#include <stdbool.h>
#include "../include/locker_pthread.h"
/**************************************************************************************************/
/*                                          DEFINES                                               */
/**************************************************************************************************/
#ifndef __DLISTNODE_H__
#define __DLISTNODE_H__

//用c语言的方式编译
#ifdef __cplusplus
extern "C"{
#endif /* _cplusplus */

/**************************************************************************************************/
/*                                          TYPES                                                 */
/**************************************************************************************************/

//DList链表的开头节点，用于描述整个链表，定义在DListNode.c中
struct _DList;
typedef struct _DList DList;

//销毁节点的回调
typedef void (*DListDataDestroyFunc)(void* ctx, void* data);
//排序时节点数据比较回调
typedef bool (*DListDataCompareFunc)(void* ctx, bool decend, void* data);
//按值查找节点数据比较回调
typedef int (*FindCompareFunc)(void* ctx, void* data);
//遍历链表时的回调
typedef DListRet (*DListDataVisitFunc)(void* ctx, void* data);

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

//可供调用者使用的链表操作函数
DList* dlist_create(DListDataDestroyFunc data_destroy, void* ctx, Locker* locker);
DListRet dlist_insert(DList* thiz, size_t index, void* data);
DListRet dlist_prepend(DList* thiz, void* data);
DListRet dlist_append(DList* thiz, void* data);
DListRet dlist_delete(DList* thiz, size_t index);
DListRet dlist_get_by_index(DList* thiz, size_t index, void** data);
DListRet dlist_set_by_index(DList* thiz, size_t index, void* data);
size_t dlist_length(DList* thiz);
int dlist_find(DList* thiz, FindCompareFunc cmp, void* ctx);
DListRet dlist_foreach(DList* thiz, DListDataVisitFunc visit, void* ctx);
void dlist_destroy(DList* thiz);
DListRet dlist_select_sort(DList* thiz, DListDataCompareFunc num_compare, void* ctx, bool decend);
DListRet dlist_bubble_sort(DList* thiz, DListDataCompareFunc num_compare, void* ctx, bool decend);

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/

#ifdef __cplusplus
}
#endif /* _cplusplus */

#endif /* __DLISTNODE_H__ */
