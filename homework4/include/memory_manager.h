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

typedef void* (*MemoryManagerAllocFunc)(Memory_Manager* thiz, size_t size);
typedef void (*MemoryManagerFreeFunc)(Memory_Manager* thiz, void* ptr);
typedef void (*MemoryManagerDestroyFunc)(Memory_Manager* thiz);

struct _Memory_Manager
{
	MemoryManagerAllocFunc alloc;
	// MemoryManagerCallocFunc calloc;
	MemoryManagerFreeFunc free;
	MemoryManagerDestroyFunc destroy;

	char priv[0];
};

typedef struct _DListNode DListNode;
typedef struct _PrivInfo PrivInfo;

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

// 内存管理器创建接口声明，在src/memory_manager.c 中定义
Memory_Manager* memory_manager_create(void* buffer, size_t length);


// void* memory_manager_calloc(Memory_Manager* thiz, size_t nmemb, size_t size);
void* memory_manager_alloc(Memory_Manager* thiz, size_t size);
void memory_manager_free(Memory_Manager* thiz, void* ptr);
void memory_manager_destroy(Memory_Manager* thiz);

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/

#ifdef __cplusplus
}
#endif /* __cplusplus__ */

#endif /* __MEMORY_MANAGER_H__ */