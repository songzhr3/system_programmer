// hash_table.c
#include "../include/hash_table.h"
#include "../include/DListNode.h"

struct _HASH_TABLE
{
	DListDataHashFunc hash;
	DList** buckets;
	size_t bucketsLength;
	void* data_destroy_ctx;
	DListDataDestroyFunc data_destroy;
};

struct _KEY_VALUE
{
	void* key;
	void* value;
};

HASH_TABLE* hash_table_create(DListDataDestroyFunc data_destroy, void* ctx, DListDataHashFunc hash, int bucketsLength)
{
	HASH_TABLE* thiz = NULL;
	return_val_if_fail(hash != NULL && bucketsLength > 1, NULL);

	thiz  = (HASH_TABLE*)malloc(sizeof(HASH_TABLE));
	if (thiz != NULL)
	{
		thiz->hash = hash;
		thiz->data_destroy = data_destroy;
		thiz->data_destroy_ctx = ctx;
		thiz->bucketsLength = bucketsLength;
		if ((thiz->buckets = (DList**)calloc(sizeof(DList*)*bucketsLength, 1)) == NULL)
		{
			free(thiz);
			thiz = NULL;
		}
	}

	return thiz;
}

DListRet hash_table_insert(HASH_TABLE* thiz, void* data)
{
	size_t index = 0;
	return_val_if_fail(thiz != NULL, DLIST_RET_PARAMS);

	index = thiz->hash(data) % thiz->bucketsLength;
	if (thiz->buckets[index] == NULL)
	{
		thiz->buckets[index] = dlist_create(thiz->data_destroy, thiz->data_destroy_ctx, NULL);
	}

	return dlist_prepend(thiz->buckets[index], data);
}

DListRet hash_table_delete(HASH_TABLE* thiz, FindCompareFunc cmp, void* data)
{
	DList* dlist = NULL;
	size_t index = 0;

	return_val_if_fail(thiz != NULL && cmp != NULL, DLIST_RET_PARAMS);

	index = thiz->hash(data) % thiz->bucketsLength;
	dlist = thiz->buckets[index];
	if (dlist != NULL)
	{
		index = dlist_find(dlist, cmp, data);
		return dlist_delete(dlist, index);
	}

	return DLIST_RET_FAIL;
}

DListRet hash_table_find(HASH_TABLE* thiz, FindCompareFunc cmp, void* data, void** ret_data)
{
	size_t index = 0;
	DList* dlist = NULL;

	return_val_if_fail(thiz != NULL &&  cmp != NULL, DLIST_RET_PARAMS);

	index = thiz->hash(data) % thiz->bucketsLength;
	dlist = thiz->buckets[index];
	if (dlist != NULL)
	{
		index = dlist_find(dlist, cmp, data);

		return dlist_get_by_index(dlist, index, ret_data);
	}

	return DLIST_RET_FAIL;
}

DListRet hash_table_foreach(HASH_TABLE* thiz, DListDataVisitFunc visit, void* ctx)
{
	int i = 0;
	return_val_if_fail(thiz != NULL && visit != NULL, DLIST_RET_PARAMS);

	for (i = 0; i < thiz->bucketsLength; i++)
	{
		if (thiz->buckets[i] != NULL)
		{
			dlist_foreach(thiz->buckets[i], visit, ctx);
		}
	}

	return DLIST_RET_OK;
}

size_t hash_table_length(HASH_TABLE* thiz)
{
	size_t totalLength = 0;
	int i = 0;
	return_val_if_fail(thiz != NULL, 0);

	for (i = 0; i < thiz->bucketsLength; i++)
	{
		if (thiz->buckets[i] != NULL)
		{
			totalLength += dlist_length(thiz->buckets[i]);
		}
	}

	return totalLength;
}

void hash_table_destroy(HASH_TABLE* thiz)
{
	int i = 0;
	if (thiz != NULL)
	{
		for (i = 0; i < thiz->bucketsLength; i++)
		{
			if (thiz->buckets[i] != NULL)
			{
				dlist_destroy(thiz->buckets[i]);
				thiz->buckets[i] = NULL;
			}
		}

		free(thiz->buckets);
		free(thiz);
	}

	return;
}