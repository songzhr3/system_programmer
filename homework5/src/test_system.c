#include <stdlib.h>
#include <stdio.h>

int main()
{
	printf("running ps with system\n");
	
	int code = system("ps au");
	
	printf("%d\n", code);
	printf("ps Done\n");
	exit(0);
}