// hash_table.h
# include<stdio.h>
#include "../include/DListNode.h"

#ifndef __HASH_TABLE_H__
#define __HASH_TABLE_H__

#ifdef __cplusplus
extern "C"{
#endif /*__cplusplus*/

struct _HASH_TABLE;
typedef struct _HASH_TABLE HASH_TABLE;


// hash 回调函数
typedef int (*DListDataHashFunc) (void* data);

// 可供调用的队列基本操作函数
HASH_TABLE* hash_table_create(DListDataDestroyFunc data_destroy, void* ctx, DListDataHashFunc hash, int bucketsLength);
DListRet hash_table_insert(HASH_TABLE* thiz, void* data);
DListRet hash_table_delete(HASH_TABLE* thiz, FindCompareFunc cmp, void* data);
DListRet hash_table_find(HASH_TABLE* thiz, FindCompareFunc cmp, void* data, void** ret_data);
DListRet hash_table_foreach(HASH_TABLE* thiz, DListDataVisitFunc visit, void* ctx);
size_t hash_table_length(HASH_TABLE* thiz);
void hash_table_destroy(HASH_TABLE* thiz);

#ifdef __cplusplus
}
#endif /*__cplusplus*/
	
#endif/*__HASH_TABLE_H__*/