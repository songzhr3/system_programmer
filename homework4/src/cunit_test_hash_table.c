/*!Copyright(c) 2008-2020 Shenzhen TP-LINK Technologies Co.Ltd.
 *
 *\file    cunit_test_hash_table.c
 *\brief   Unit test for hash_table.c.
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
#include "../include/hash_table.h"
/**************************************************************************************************/
/*                                          DEFINES                                               */
/**************************************************************************************************/
#define N_HASH_TABLE 5
#define BUCKETS_LENGTH 5
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

// 哈希函数回调函数
static int hash_int(void* data)
{
	return *(int*)data;
}

// 比较回调函数
static int cmp_int(void* ctx, void* data)
{
	return *(int*)ctx - *(int*)data;
}

// 打印回调函数
static DListRet print_int(void* ctx, void* data)
{
	printf("%d ", *(int*)data);

	return DLIST_RET_OK;
} 

//  unit test for hash_table_create()
void test_hash_table_create()
{
	// hash function is NULL
	HASH_TABLE* hash_table = hash_table_create(NULL, NULL, NULL, BUCKETS_LENGTH);
	CU_ASSERT_PTR_NULL(hash_table);

	// bucketsLength = 1
	hash_table = hash_table_create(NULL, NULL, hash_int, 1);
	CU_ASSERT_PTR_NULL(hash_table);
	
	// bucketsLength < 0
	hash_table = hash_table_create(NULL, NULL, hash_int, -1);
	CU_ASSERT_PTR_NULL(hash_table);

	// normal parameter
	hash_table = hash_table_create(NULL, NULL, hash_int, BUCKETS_LENGTH);
	CU_ASSERT_PTR_NOT_NULL(hash_table);
}

// unit test for hash_table_insert()
void test_hash_table_insert()
{
	int i = 0;
	int data = 0;
	int *pdata = &data;

	int nums[N_HASH_TABLE];
	for (i = 0; i < N_HASH_TABLE; i++)
	{
		nums[i] = i;
	}

	// hash_table is NULL
	DListRet hashTableNullCase = hash_table_insert(NULL, NULL);
	CU_ASSERT_EQUAL(hashTableNullCase, DLIST_RET_PARAMS);

	// create a new hash_table
	HASH_TABLE* hash_table = hash_table_create(NULL, NULL, hash_int, BUCKETS_LENGTH);

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		CU_ASSERT_EQUAL(hash_table_length(hash_table), i);
		CU_ASSERT_EQUAL(hash_table_insert(hash_table, &nums[i]), DLIST_RET_OK);
		CU_ASSERT_EQUAL(hash_table_length(hash_table), i + 1);
		CU_ASSERT_EQUAL(hash_table_find(hash_table, cmp_int, &nums[i], (void**)&pdata), DLIST_RET_OK);
		CU_ASSERT_EQUAL(*pdata, i);
	}

	// delete the hash_table
	for(i = 0; i < N_HASH_TABLE; i++)
	{
		CU_ASSERT_EQUAL(hash_table_length(hash_table), N_HASH_TABLE - i);
		CU_ASSERT_EQUAL(hash_table_delete(hash_table, cmp_int, &nums[i]), DLIST_RET_OK);
	}

	// destroy the hash_table
	hash_table_destroy(&hash_table);
	CU_ASSERT_PTR_NULL(hash_table);
}

// unit test for hash_table_insert()
void test_hash_table_delete()
{
	int nums[N_HASH_TABLE];
	int i = 0;
	for (i = 0; i < N_HASH_TABLE; i++)
	{
		nums[i] = i;
	}

	int data = 0;
	int *pdata = &data;

	// hash_table is NULL
	DListRet hashTableNullCase = hash_table_delete(NULL, cmp_int, pdata);
	CU_ASSERT_EQUAL(hashTableNullCase, DLIST_RET_PARAMS);
	
	HASH_TABLE* hash_table = hash_table_create(NULL, NULL, hash_int, BUCKETS_LENGTH);
	CU_ASSERT_PTR_NOT_NULL(hash_table);

	// FindCompareFunc cmp_int is NULL
	hashTableNullCase = hash_table_delete(hash_table, NULL, pdata);
	CU_ASSERT_EQUAL(hashTableNullCase, DLIST_RET_PARAMS);

	hash_table = hash_table_create(NULL, NULL, hash_int, BUCKETS_LENGTH);	

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		CU_ASSERT_EQUAL(hash_table_insert(hash_table, &nums[i]), DLIST_RET_OK);
		CU_ASSERT_EQUAL(hash_table_length(hash_table), i+1);
	}

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		CU_ASSERT_EQUAL(hash_table_length(hash_table), N_HASH_TABLE - i);
		CU_ASSERT_EQUAL(hash_table_delete(hash_table, cmp_int, &nums[i]), DLIST_RET_OK);
	}

	hash_table_destroy(&hash_table);
	CU_ASSERT_PTR_NULL(hash_table);
}

// unit test for hash_table_find()
void test_hash_table_find()
{
	int i = 0;
	int data = 0;
	int *pdata = &data;

	int nums[N_HASH_TABLE];
	for (i = 0; i < N_HASH_TABLE; i++)
	{
		nums[i] = i;
	}
	// hash_table is NULL
	DListRet hashTableNullCase = hash_table_find(NULL, cmp_int, &nums[i], (void**)&pdata);
	CU_ASSERT_EQUAL(hashTableNullCase, DLIST_RET_PARAMS);

	// create a new hash_table
	HASH_TABLE* hash_table = hash_table_create(NULL, NULL, hash_int, BUCKETS_LENGTH);

	// FindCompareFunc cmp_int is NULL
	hashTableNullCase = hash_table_find(hash_table, NULL, &nums[i], (void**)&pdata);
	CU_ASSERT_EQUAL(hashTableNullCase, DLIST_RET_PARAMS);

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		CU_ASSERT_EQUAL(hash_table_length(hash_table), i);
		CU_ASSERT_EQUAL(hash_table_insert(hash_table, &nums[i]), DLIST_RET_OK);
		CU_ASSERT_EQUAL(hash_table_length(hash_table), i + 1);
		CU_ASSERT_EQUAL(hash_table_find(hash_table, cmp_int, &nums[i], (void**)&pdata), DLIST_RET_OK);
		CU_ASSERT_EQUAL(*pdata, i);
	}

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		CU_ASSERT_EQUAL(hash_table_length(hash_table), N_HASH_TABLE - i);
		CU_ASSERT_EQUAL(hash_table_delete(hash_table, cmp_int, &nums[i]), DLIST_RET_OK);
	}

	hash_table_destroy(&hash_table);
	CU_ASSERT_PTR_NULL(hash_table);
}

// unit test for hash_table_foreach()
void test_hash_table_foreach()
{
	//thiz = NULL
	int data = 1;
	int *ctx = &data;

	// hash_table is NULL
	CU_ASSERT_EQUAL(hash_table_foreach(NULL, print_int, ctx), DLIST_RET_PARAMS);

	// print_int is NULL
	HASH_TABLE* hash_table = hash_table_create(NULL, NULL, hash_int, BUCKETS_LENGTH);
	CU_ASSERT_EQUAL(hash_table_insert(hash_table, &data), DLIST_RET_OK);
	CU_ASSERT_EQUAL(hash_table_foreach(hash_table, NULL, ctx), DLIST_RET_PARAMS);

	// ctx = NULL
	CU_ASSERT_EQUAL(hash_table_foreach(hash_table, print_int, NULL), DLIST_RET_OK);

	// nomal case
	CU_ASSERT_EQUAL(hash_table_foreach(hash_table, print_int, ctx), DLIST_RET_OK);
}

// unit test for hash_table_length()
void test_hash_table_length()
{
	int nums[N_HASH_TABLE];
	int i = 0;
	for (i = 0; i < N_HASH_TABLE; i++)
	{
		nums[i] = i;
	}

	// hash_table is NULL
	CU_ASSERT_EQUAL(hash_table_length(NULL), 0);

	HASH_TABLE* hash_table = hash_table_create(NULL, NULL, hash_int, BUCKETS_LENGTH);	

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		CU_ASSERT_EQUAL(hash_table_insert(hash_table, &nums[i]), DLIST_RET_OK);
		CU_ASSERT_EQUAL(hash_table_length(hash_table), i+1);
	}

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		CU_ASSERT_EQUAL(hash_table_length(hash_table), N_HASH_TABLE - i);
		CU_ASSERT_EQUAL(hash_table_delete(hash_table, cmp_int, &nums[i]), DLIST_RET_OK);
	}

	hash_table_destroy(&hash_table);
	CU_ASSERT_PTR_NULL(hash_table);
}

// unit test for hash_table_destroy()
void test_hash_table_destroy()
{
	// thiz = NULL
	HASH_TABLE* hash_table = NULL;
	hash_table_destroy(&hash_table);
	CU_ASSERT_PTR_NULL(hash_table);

	int data = 1;

	// create a new hash_table
	hash_table = hash_table_create(NULL, NULL, hash_int, BUCKETS_LENGTH);
	CU_ASSERT_EQUAL(hash_table_insert(hash_table, &data), DLIST_RET_OK);

	// destroy hash_table
	hash_table_destroy(&hash_table);
	CU_ASSERT_PTR_NULL(hash_table);
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

CU_TestInfo test_hash_table_case[] = 
{
	{"test_hash_table_create", test_hash_table_create},
	{"test_hash_table_insert", test_hash_table_insert},
	{"test_hash_table_delete", test_hash_table_delete},
	{"test_hash_table_find", test_hash_table_find},
	{"test_hash_table_foreach", test_hash_table_foreach},
	{"test_hash_table_length", test_hash_table_length},
	{"test_hash_table_destroy", test_hash_table_destroy},
	CU_TEST_INFO_NULL
};

CU_SuiteInfo suites[] = 
{
	{"test_hash_table_case", suite_success_init, suite_success_clean, NULL, NULL, test_hash_table_case},
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
	
	// add suites to register
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

    // registry clean function
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