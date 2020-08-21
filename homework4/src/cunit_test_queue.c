/*!Copyright(c) 2008-2020 Shenzhen TP-LINK Technologies Co.Ltd.
 *
 *\file    cunit_test_queue.c
 *\brief   Unit test for queue.c.
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
#include <stdio.h>
#include <assert.h>
#include <CUnit/Basic.h>
#include <CUnit/Console.h>
#include <CUnit/Automated.h>
#include <CUnit/CUnit.h>
#include <CUnit/TestDB.h>
#include "../include/DListNode.h"
#include "../include/queue.h"
/**************************************************************************************************/
/*                                          DEFINES                                               */
/**************************************************************************************************/
#define N_QUEUE 10
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

// unit test for queue_create()
void test_queue_create()
{
	Queue* queue = queue_create(NULL, NULL);
	CU_ASSERT_PTR_NOT_NULL(queue);
}

// unit test for queue_head()
void test_queue_head()
{
	int data = 0;
	int *pdata = &data;

	// queue && void** data is NULL
	DListRet queueNullCase = queue_head(NULL, NULL);
	CU_ASSERT_EQUAL(queueNullCase, DLIST_RET_PARAMS);

	// queue is NULL
	queueNullCase = queue_head(NULL, (void**)&pdata);
	CU_ASSERT_EQUAL(queueNullCase, DLIST_RET_PARAMS);

	// void** data is NULL
	Queue* queue = queue_create(NULL, NULL);
	CU_ASSERT_PTR_NOT_NULL(queue);
	queueNullCase = queue_head(queue, NULL);
	CU_ASSERT_EQUAL(queueNullCase, DLIST_RET_PARAMS);
}

// unit test for queue_push()
void test_queue_push()
{
	int data = 0;
	int *pdata = &data;

	int nums[N_QUEUE];
	int i = 0;
	for (i = 0; i < N_QUEUE; i++)
	{
		nums[i] = i;
	}

	// queue is NULL
	DListRet queueNullCase = queue_head(NULL, NULL);
	CU_ASSERT_EQUAL(queueNullCase, DLIST_RET_PARAMS);

	queueNullCase = queue_head(NULL, (void**)&pdata);
	CU_ASSERT_EQUAL(queueNullCase, DLIST_RET_PARAMS);

	Queue* queue = queue_create(NULL, NULL);		

	for(i = 0; i < N_QUEUE; i++)
	{
		CU_ASSERT_EQUAL(queue_push(queue, &nums[i]), DLIST_RET_OK);
		CU_ASSERT_EQUAL(queue_head(queue, (void**)&pdata), DLIST_RET_OK);
		CU_ASSERT_EQUAL(queue_length(queue), i+1);
	}

	for(i = 0; i < N_QUEUE; i++)
	{
		CU_ASSERT_EQUAL(queue_head(queue, (void**)&pdata), DLIST_RET_OK);
		CU_ASSERT_EQUAL(queue_length(queue), N_QUEUE - i);
		CU_ASSERT_EQUAL(queue_pop(queue), DLIST_RET_OK);
	}

	queue_destroy(&queue);
	CU_ASSERT_PTR_NULL(queue);
}

// unit test for queue_pop()
void test_queue_pop()
{
	int nums[N_QUEUE];
	int i = 0;
	for (i = 0; i < N_QUEUE; i++)
	{
		nums[i] = i;
	}

	int data = 0;
	int *pdata = &data;

	// queue is NULL
	DListRet queueNullCase = queue_pop(NULL);
	CU_ASSERT_EQUAL(queueNullCase, DLIST_RET_PARAMS);

	Queue* queue = queue_create(NULL, NULL);		

	for(i = 0; i < N_QUEUE; i++)
	{
		CU_ASSERT_EQUAL(queue_push(queue, &nums[i]), DLIST_RET_OK);
		CU_ASSERT_EQUAL(queue_head(queue, (void**)&pdata), DLIST_RET_OK);
		CU_ASSERT_EQUAL(queue_length(queue), i+1);
	}

	for(i = 0; i < N_QUEUE; i++)
	{
		CU_ASSERT_EQUAL(queue_head(queue, (void**)&pdata), DLIST_RET_OK);
		CU_ASSERT_EQUAL(queue_length(queue), N_QUEUE - i);
		CU_ASSERT_EQUAL(queue_pop(queue), DLIST_RET_OK);
	}

	queue_destroy(&queue);
	CU_ASSERT_PTR_NULL(queue);
}

// 打印回调函数
DListRet print_int(void* ctx, void* data)
{
	return DLIST_RET_OK;
}

// unit test for queue_foreach()
void test_queue_foreach()
{
	//thiz = NULL
	int data = 1;
	int *ctx = &data;
	CU_ASSERT_EQUAL(queue_foreach(NULL, print_int, ctx), DLIST_RET_PARAMS);

	// print_int = NULL
	Queue* queue = queue_create(NULL, NULL);	
	CU_ASSERT_EQUAL(queue_push(queue, &data), DLIST_RET_OK);
	CU_ASSERT_EQUAL(queue_foreach(queue, NULL, ctx), DLIST_RET_PARAMS);

	// ctx = NULL
	CU_ASSERT_EQUAL(queue_foreach(queue, print_int, NULL), DLIST_RET_OK);

	// nomal case
	CU_ASSERT_EQUAL(queue_foreach(queue, print_int, ctx), DLIST_RET_OK);
}

// unit test for queue_length()
void test_queue_length()
{
	int nums[N_QUEUE];
	int i = 0;
	for (i = 0; i < N_QUEUE; i++)
	{
		nums[i] = i;
	}

	// queue is NULL
	CU_ASSERT_EQUAL(queue_length(NULL), 0);

	Queue* queue = queue_create(NULL, NULL);		

	for(i = 0; i < N_QUEUE; i++)
	{
		CU_ASSERT_EQUAL(queue_push(queue, &nums[i]), DLIST_RET_OK);
		CU_ASSERT_EQUAL(queue_length(queue), i+1);
	}

	for(i = 0; i < N_QUEUE; i++)
	{
		CU_ASSERT_EQUAL(queue_length(queue), N_QUEUE - i);
		CU_ASSERT_EQUAL(queue_pop(queue), DLIST_RET_OK);
	}

	queue_destroy(&queue);
	CU_ASSERT_PTR_NULL(queue);
}

// unit test for queue_destroy()
void test_queue_destroy()
{
	// thiz = NULL
	Queue* queue = NULL;
	queue_destroy(&queue);
	CU_ASSERT_PTR_NULL(queue);

	int data = 1;
	
	queue = queue_create(NULL, NULL);	
	CU_ASSERT_EQUAL(queue_push(queue, &data), DLIST_RET_OK);

	queue_destroy(&queue);
	CU_ASSERT_PTR_NULL(queue);
}

// suite init function
int suite_success_init(void)
{
	return 0;
}

// suite clean function
int suite_success_clean(void)
{
	return 0;
}

CU_TestInfo test_queue_case[] = 
{
	{"test_queue_create", test_queue_create},
	{"test_queue_head", test_queue_head},
	{"test_queue_push", test_queue_push},
	{"test_queue_pop", test_queue_pop},
	{"test_queue_foreach", test_queue_foreach},
	{"test_queue_length", test_queue_length},
	{"test_queue_destroy", test_queue_destroy},
	CU_TEST_INFO_NULL
};

CU_SuiteInfo suites[] = 
{
	{"test_queue_case", suite_success_init, suite_success_clean, NULL, NULL, test_queue_case},
	CU_SUITE_INFO_NULL
};

// test function
int run_test()
{
	//initialize the CUnit test registry
	if (CUE_SUCCESS != CU_initialize_registry())
	{
		return CU_get_error();
	}
	
	if (CUE_SUCCESS != CU_register_suites(suites))
	{
		CU_cleanup_registry();
		return CU_get_error();
	}
	
    // Automated Mode 
    // CU_set_output_filename("TestMax");
    // CU_list_tests_to_file();
    // CU_automated_run_tests();
    
    // Basice Mode 
    CU_basic_set_mode(CU_BRM_VERBOSE);
    CU_basic_run_tests();
   
    // Console Mode 
    // CU_console_run_tests();
    
    // registry clean
	CU_cleanup_registry();
	
	return CU_get_error();
}

// main function
int main(int argv, char* argc[])
{
	return run_test();
}

/**************************************************************************************************/
/*                                          PUBLIC_FUNCTIONS                                      */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/