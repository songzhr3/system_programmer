// test_hash_table.c
#include <assert.h>
#include "../include/DListNode.h"
#include "../include/hash_table.h"

#define N_HASH_TABLE 5

typedef struct _KEY_VALUE KEY_VALUE;
{
	int key;
	
}

static int hash_int(void* data)
{
	return *(int*)data;
}

static int cmp_int(void* ctx, void* data)
{
	return *(int*)ctx - *(int*)data;
}

static DListRet print_int(void* ctx, void* data)
{
	printf("%d ", *(int*)data);

	return DLIST_RET_OK;
}

int main(int argc, char* argv[])
{
	int i = 0;
	// int ret_data = 0;
	int nums[N_HASH_TABLE];
	for (i = 0; i < N_HASH_TABLE; i++)
	{
		nums[i] = i;
	}

	HASH_TABLE* hash_table = hash_table_create(NULL, NULL, hash_int, 30);

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		assert(hash_table_length(hash_table) == i);
		assert(hash_table_insert(hash_table, &nums[i]) == DLIST_RET_OK);
		assert(hash_table_length(hash_table) == (i + 1));
		// assert(hash_table_find(hash_table, cmp_int, (void*)i, (void**)&ret_data) == DLIST_RET_OK);
		// assert(ret_data == i);
	}

	hash_table_foreach(hash_table, print_int, NULL);
	printf("\n");

	for(i = 0; i < N_HASH_TABLE; i++)
	{
		assert(hash_table_delete(hash_table, cmp_int,&nums[i]) == DLIST_RET_OK);
		assert(hash_table_length(hash_table) == (N_HASH_TABLE - i -1));
		// assert(hash_table_find(hash_table, cmp_int, (void*)i, (void**)&ret_data) != DLIST_RET_OK);
	}
	
	hash_table_destroy(hash_table);

	return 0;
}