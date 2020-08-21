/*!Copyright(c) 2008-2020 Shenzhen TP-LINK Technologies Co.Ltd.
 *
 *\file    test_producer_consumer.c
 *\brief   Test for producer consumer model
 *\details 
 *
 *\author  Song Zhanren
 *\version 1.0.0
 *\date	   17Aug20
 *
 *\warning
 *
 *\history \
 *
 *
 */
/**************************************************************************************************/
/*											CONFIGURATIONS										  */
/**************************************************************************************************/
	
/**************************************************************************************************/
/*											INCLUDE_FILES										  */
/**************************************************************************************************/
#include <assert.h>
#include <pthread.h>
#include <unistd.h>
#include "../include/DListNode.h"
/**************************************************************************************************/
/*                                          DEFINES                                               */
/**************************************************************************************************/
#define N_NUMS 5
/**************************************************************************************************/
/*                                          TYPES                                                 */
/**************************************************************************************************/

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

// 打印整型数据的回调函数
static DListRet print_int(void* ctx, void* data)
{
	printf("%d ", *(int*)data);

	return DLIST_RET_OK;
}

// 测试单线程下链表的基本操作
static void test_init_dlist(void)
{
	int i = 0;
	int nums[N_NUMS];

	for (i = 0; i < N_NUMS; i++)
	{
		nums[i] = i;
	}

	// 创建单线程的链表，第三个参数NULL表示不传入锁，指示单线程版本
	DList* dlist = dlist_create(NULL, NULL, NULL);

	//链表的尾插创建，获取长度检测，遍历操作测试
	for(i = 0; i < N_NUMS; i++)
	{
		assert(dlist_append(dlist, &nums[i]) == DLIST_RET_OK);
		assert(dlist_length(dlist) == (i + 1));
		dlist_foreach(dlist, print_int, NULL);
		printf("\n");
	}

	// 链表删除测试
	for(i = 0; i < N_NUMS; i++)
	{
		assert(dlist_length(dlist) == (N_NUMS-i));
		assert(dlist_delete(dlist, 0) == DLIST_RET_OK);
		assert(dlist_length(dlist) == (N_NUMS-i-1));
		dlist_foreach(dlist, print_int, NULL);
		printf("\n");
	}
	
	assert(dlist_length(dlist) == 0);
	
	// 链表头插创建测试
	for(i = 0; i < N_NUMS; i++)
	{
		assert(dlist_prepend(dlist, &nums[i]) == DLIST_RET_OK);
		assert(dlist_length(dlist) == (i + 1));
		dlist_foreach(dlist, print_int, NULL);
		printf("\n");
	}

	//销毁整个链表测试
	dlist_destroy(dlist);
	
	return;
}

// 链表对特殊输入的基本操作测试
static void test_invalid_params(void)
{
	printf("===========test_invalid_params begin. warning is ok==============\n");
	assert(dlist_length(NULL) == 0);
	assert(dlist_prepend(NULL, 0) == DLIST_RET_PARAMS);
	assert(dlist_append(NULL, 0) == DLIST_RET_PARAMS);
	assert(dlist_delete(NULL, 0) == DLIST_RET_PARAMS);
	assert(dlist_insert(NULL, 0, 0) == DLIST_RET_PARAMS);
	assert(dlist_set_by_index(NULL, 0, 0) == DLIST_RET_PARAMS);
	assert(dlist_get_by_index(NULL, 0, NULL) == DLIST_RET_PARAMS);
	assert(dlist_find(NULL, NULL, NULL) < 0);
	assert(dlist_foreach(NULL, NULL, NULL) == DLIST_RET_PARAMS);
	printf("===========test_invalid_params finish==============\n");

	return;
}

// 单线程版本的通用链表测试
void single_thread_test(void)
{
	//测试基本操作
	test_init_dlist();

	//测试特殊输入
	test_invalid_params();

	return;
}

// 消费者-生产者模型中的生产者；用于创建链表、添加节点
static void* producer(void* param)
{
	int i = 0;
	DList* dlist = (DList*)param;

	int nums[N_NUMS*2];
	for (i = 0; i < N_NUMS*2; i++)
	{
		nums[i] = i;
	}

	// 生产者创建链表、添加节点
	for(i = 0; i < N_NUMS; i++)
	{
		assert(dlist_append(dlist, &nums[i]) == DLIST_RET_OK);
	}

	dlist_foreach(dlist, print_int, NULL);
	printf("\n");

	// 生产者线程进入休眠
	sleep(1);
	for(i = 0; i < N_NUMS; i++)
	{
		assert(dlist_prepend(dlist, &nums[i]) == DLIST_RET_OK);
	}

	dlist_foreach(dlist, print_int, NULL);
	printf("\n");

	for(i = 0; i < N_NUMS*2; i++)
	{
		// 生产者进入休眠
		sleep(1);

		//打印消费者线程运行后的链表
		dlist_foreach(dlist, print_int, NULL);
		printf("\n");	
	}
	
	return NULL;
}

// 消费者-生产者模型中的消费者；用于从链表中取数据
static void* consumer(void* param)
{
	int i = 0;
	DList* dlist = (DList*)param;

	for(i = 0; i < N_NUMS*2; i++)
	{
		// 消费者进入休眠
		sleep(1);
		assert(dlist_delete(dlist, 0) == DLIST_RET_OK);	
	}
	
	return NULL;
}

// 多线程版本测试，消费者-生产者模型
void multi_thread_test(void)
{
	// 消费者线程号
	pthread_t consumer_tid = 0;

	//生产者线程号
	pthread_t producer_tid = 0;

	// 创建多线程版本的链表，第三个参数传入Locker*（locker_pthread_create()）
	// Locker*产生加锁函数指针、解锁函数指针、锁对象；用于指示多线程版本
	DList* dlist = dlist_create(NULL, NULL, locker_pthread_create());

	//创建生产者、消费者线程
	pthread_create(&producer_tid, NULL, producer, dlist);
	pthread_create(&consumer_tid, NULL, consumer, dlist);
	
	// pthread_join(consumer_tid, NULL);
	// pthread_join(producer_tid, NULL);

	// 主线程等待生产者线程运行结束
	if (!pthread_join(producer_tid, NULL))
	{
		printf("producer thread finish...\n");
	}

	// 主线程等待消费者线程运行结束
	if (!pthread_join(consumer_tid, NULL))
	{
		printf("consumer thread finish...\n");
	}

	return;
}

// main function
#include "../include/locker_pthread.h"
#include "../include/producer_consumer.h"

int main(int argc, char* argv[])
{
	// printf("now test single_thread.\n");
	// single_thread_test();

	// printf("\n");

	printf("now test multi_thread.\n");
	multi_thread_test();

	printf("test finish.\n");
	getchar();
	return 0;
}

/**************************************************************************************************/
/*                                          PUBLIC_FUNCTIONS                                      */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/