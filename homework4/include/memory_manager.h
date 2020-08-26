/*!Copyright(c) 2008-2020 Shenzhen TP-LINK Technologies Co.Ltd.
 *
 *\file    memory_manager.h
 *\brief   The head file of memory_manager.c
 *
 *\author  Song Zhanren
 *\version 1.0.0
 *\date	   19Aug20
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
#include <stdio.h>
/**************************************************************************************************/
/*                                          DEFINES                                               */
/**************************************************************************************************/
#ifndef __MEMORY_MANAGER_H__
#define __MEMORY_MANAGER_H__

#ifdef __cplusplus
extern "C"{
#endif /* __cplusplus */


#define return_if_fail(p) if(!(p))\
	{printf("%s:%d Warning: "#p" failed.\n", \
		__func__, __LINE__); return;}

#define return_val_if_fail(p, ret) if (!(p)) \
	{printf("%s:%d Warning: "#p" failed.\n", \
		__func__, __LINE__); return (ret);}

#define SAFE_FREE(p) if (NULL != p) {free(p); p = NULL;}

/**************************************************************************************************/
/*                                          TYPES                                                 */
/**************************************************************************************************/
struct _Memory_Manager;
typedef struct _Memory_Manager Memory_Manager;

/*
* 内存分配函数指针
*/
typedef void* (*MemoryManagerAllocFunc)(Memory_Manager* thiz, size_t size);

/*
* 内存释放函数指针
*/
typedef void (*MemoryManagerFreeFunc)(Memory_Manager* thiz, void* ptr);

/*
* 内存管理器销毁函数指针
*/
typedef void (*MemoryManagerDestroyFunc)(Memory_Manager** thiz);

struct _Memory_Manager
{
	MemoryManagerAllocFunc alloc;
	MemoryManagerFreeFunc free;
	MemoryManagerDestroyFunc destroy;

	char priv[0];        /* 可变长数据成员 */
};

typedef struct _DListNode DListNode;
typedef struct _PrivInfo PrivInfo;

struct _DListNode
{
	size_t length;                /* 空闲内存块大小 */
	struct _DListNode* prev;      /* 指向前一个空闲内存块 */
	struct _DListNode* next;      /* 指向后一个空闲内存块 */
};

#define MIN_SIZE sizeof(DListNode)

#define REAL_NEED_SZIE(size) ((size > sizeof(DListNode)? size : MIN_SIZE) + sizeof(size_t))

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

/*
* 内存管理器创建接口声明，在src/memory_manager.c 中定义
*/
Memory_Manager* memory_manager_create(void* buffer, size_t length);

/*
* 内存管理器内存分配接口，在src/memory_manager.c 中定义
*/
void* memory_manager_alloc(Memory_Manager* thiz, size_t size);

/*
* 内存管理器内存释放接口，在src/memory_manager.c 中定义
*/
void memory_manager_free(Memory_Manager* thiz, void* ptr);

/*
* 内存管理器销毁接口，在src/memory_manager.c 中定义
*/
void memory_manager_destroy(Memory_Manager** thiz);

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/

#ifdef __cplusplus
}
#endif /* __cplusplus__ */

#endif /* __MEMORY_MANAGER_H__ */