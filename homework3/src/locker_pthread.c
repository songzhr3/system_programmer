#include <stdlib.h>
#include <pthread.h>
#include "../include/locker_pthread.h"

// 创建互斥量，利用互斥锁给线程加锁、解锁
typedef struct _PrivInfo
{
	pthread_mutex_t mutex;
}PrivInfo;

// 线程加锁函数
static DListRet  locker_pthread_lock(Locker* thiz)
{
	PrivInfo* priv = (PrivInfo*)thiz->priv;

	// 利用互斥锁给线程加锁
	int ret = pthread_mutex_lock(&priv->mutex);

	return ret == 0 ? DLIST_RET_OK : DLIST_RET_FAIL;
}

// 线程解锁函数
static DListRet  locker_pthread_unlock(Locker* thiz)
{
	PrivInfo* priv = (PrivInfo*)thiz->priv;

	// 利用互斥锁给线程解锁
	int ret = pthread_mutex_unlock(&priv->mutex);

	return ret == 0 ? DLIST_RET_OK : DLIST_RET_FAIL;
}

// 线程锁销毁函数
static void locker_pthread_destroy(Locker* thiz)
{
	PrivInfo* priv = (PrivInfo*)thiz->priv;

	// 销毁互斥锁
	int ret = pthread_mutex_destroy(&priv->mutex);
	if (0 == ret)
	{
		printf("destroy lock success.\n");
	}

	SAFE_FREE(thiz);

	return;
}

// 线程锁创建函数，提供创建接口给调用者
// 返回Locker* 结构体指针，结构体包含指向加锁函数的指针，指向解锁函数的指针，
// 销毁互斥锁函数的指针，互斥量（互斥锁）
Locker* locker_pthread_create(void)
{
	Locker* thiz = (Locker*)malloc(sizeof(Locker) + sizeof(PrivInfo));

	if(thiz != NULL)
	{
		PrivInfo* priv = (PrivInfo*)thiz->priv;

		thiz->lock    = locker_pthread_lock;
		thiz->unlock  = locker_pthread_unlock;
		thiz->destroy = locker_pthread_destroy;

		// 初始化互斥锁
		pthread_mutex_init(&(priv->mutex), NULL);
	}

	return thiz;
}
