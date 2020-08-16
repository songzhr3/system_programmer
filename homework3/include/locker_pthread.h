// locker_pthread.h
#include <stdio.h>

#ifndef __LOCKER_PTHREAD_H__
#define __LOCKER_PTHREAD_H__


#ifdef __cplusplus
extern "C"{
#endif /* _cplusplus */

// 无返回值函数输入参数处理函数
#define return_if_fail(p) if(!(p)) \
	{printf("%s:%d Warning: "#p" failed.\n", \
		__func__, __LINE__); return;}

// 有返回值函数输入参数处理函数
#define return_val_if_fail(p, ret) if(!(p)) \
	{printf("%s:%d Warning: "#p" failed.\n",\
	__func__, __LINE__); return (ret);}

// 释放指针函数
#define SAFE_FREE(p) if(p != NULL) {free(p); p = NULL;}


struct _Locker;
typedef struct _Locker Locker;

//枚举，函数的返回值类型
typedef enum _DListRet
{
    DLIST_RET_OK,
    DLIST_RET_OOM,
    DLIST_RET_STOP,
    DLIST_RET_PARAMS,
    DLIST_RET_FAIL
}DListRet;

// 加锁、解锁、销毁锁 函数指针
typedef DListRet  (*LockerLockFunc)(Locker* thiz);
typedef DListRet  (*LockerUnlockFunc)(Locker* thiz);
typedef void (*LockerDestroyFunc)(Locker* thiz);

// 锁结构体，char priv[0] 数组用来保存互斥量
// 一次性分配内存，内存长度刚好等于所需
struct _Locker
{
	LockerLockFunc    lock;
	LockerUnlockFunc  unlock;
	LockerDestroyFunc destroy;

	char priv[0];
};

// 线程加锁内联函数，是否内联由编译器决定
static inline DListRet locker_lock(Locker* thiz)
{
	return_val_if_fail(thiz != NULL && thiz->lock != NULL, DLIST_RET_PARAMS);

	return thiz->lock(thiz);
}

// 线程解锁内联函数，是否内联由编译器决定
static inline DListRet locker_unlock(Locker* thiz)
{
	return_val_if_fail(thiz != NULL && thiz->unlock != NULL, DLIST_RET_PARAMS);

	return thiz->unlock(thiz);
}

// 销毁锁内联函数，是否内联由编译器决定
static inline void locker_destroy(Locker* thiz)
{
	return_if_fail(thiz != NULL && thiz->destroy != NULL);

	thiz->destroy(thiz);

	return;
}

// 锁创建接口声明，在src/locker_pthread.c 中定义
Locker* locker_pthread_create(void);


#ifdef __cplusplus
}
#endif /* _cplusplus */

#endif/*__LOCKER_PTHREAD_H__*/
