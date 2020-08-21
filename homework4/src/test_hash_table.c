/*!Copyright(c) 2008-2020 Shenzhen TP-LINK Technologies Co.Ltd.
 *
 *\file    test_hash_table.c
 *\brief   Test for hash_table.c.
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

// 哈希函数回调
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

// 主函数
int main(int argc, char* argv[])
{
	int i = 0;
	// int data = 0;
	// int *pdata = &data;
	int nums[N_HASH_TABLE];
	for (i = 0; i < N_HASH_TABLE; i++)
	{
		nums[i] = i;
	}

	HASH_TABLE* hash_table = hash_table_create(NULL, NULL, hash_int, BUCKETS_LENGTH);

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		assert(hash_table_length(hash_table) == i);
		assert(hash_table_insert(hash_table, &nums[i]) == DLIST_RET_OK);
		assert(hash_table_length(hash_table) == (i + 1));
		// assert(hash_table_find(hash_table, cmp_int, &nums[i], (void**)&pdata) == DLIST_RET_OK);
		// assert(data == i);
	}

	hash_table_foreach(hash_table, print_int, NULL);
	printf("\n");

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		assert(hash_table_delete(hash_table, cmp_int,&nums[i]) == DLIST_RET_OK);
		assert(hash_table_length(hash_table) == (N_HASH_TABLE - i -1));
		// assert(hash_table_find(hash_table, cmp_int, &nums[i], (void**)&pdata) != DLIST_RET_OK);
	}
	
	hash_table_destroy(hash_table);

	return 0;
}

/**************************************************************************************************/
/*                                          PUBLIC_FUNCTIONS                                      */
/**************************************************************************************************/

/**************************************************************************************************/
/*                                          GLOBAL_FUNCTIONS                                      */
/**************************************************************************************************/