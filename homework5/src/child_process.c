#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <limits.h>
#include <fcntl.h>
#include <string.h>

static void init()
{
	const char *fifoName = "/tmp/my_fifo";
	const int openMode = O_WRONLY;

	int pipeFd = -1;
	int res = 0;
	pid_t pid = 0;
	char buffer[PIPE_BUF + 1] = "init ok";

	if (-1 == access(fifoName, F_OK))
	{
		res = mkfifo(fifoName, 0777);
		if (0 != res)
		{
			fprintf(stderr, "could not create fifo\n");
			exit(EXIT_FAILURE);
		}
	}

	pid = getpid();
	printf("process %d opening fifo O_WRONLY\n", pid);

	pipeFd = open(fifoName, openMode);
	printf("pipeFd is %d\n", pipeFd);

	if (-1 != pipeFd)
	{
		printf("song\n");
		res = write(pipeFd, buffer, strlen(buffer));
		if (-1 == res)
		{
			fprintf(stderr, "write error\n");
			exit(EXIT_FAILURE);
		}

		close(pipeFd);
	}
	else
	{
		printf("zhan\n");
		exit(EXIT_FAILURE);
	}

	printf("process %d finished.\n",getpid());
    exit(EXIT_SUCCESS);
}

static void heart_beat()
{
	const char *fifoName = "/tmp/my_fifo";
	const int openMode = O_WRONLY;

	int pipeFd = -1;
	int res = 0;
	pid_t pid = 0;

	if (-1 == access(fifoName, F_OK))
	{
		res = mkfifo(fifoName, 0777);
		if (0 != res)
		{
			fprintf(stderr, "could not create fifo\n");
			exit(EXIT_FAILURE);
		}
	}

	pid = getpid();
	printf("process %d opening fifo O_WRONLY\n", pid);
	// printf("hhh\n");
	pipeFd = open(fifoName, openMode);
	

	if (-1 != pipeFd)
	{
		res = write(pipeFd, &pid, sizeof(pid));
		if (-1 == res)
		{
			fprintf(stderr, "write error\n");
			exit(EXIT_FAILURE);
		}

		close(pipeFd);
	}
	else
	{
		exit(EXIT_FAILURE);
	}

	printf("process %d finished.\n",getpid());
    exit(EXIT_SUCCESS);
}

int main()
{
	init();
	heart_beat();

	return 0;
}