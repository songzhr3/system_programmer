
#include <unistd.h>

#include <stdarg.h>

#include <time.h>

#include <sys/types.h>

#include <sys/wait.h>

#include <stdio.h>

#include <stdlib.h>

 

int tprintf (const char *fnt,...);

 

int main(void)

{

       pid_t pid1,pid2;

       int i;

       printf("Hellofrom parent process,pid is %d.\n",getpid());

      

       pid1=fork();

      

       if(pid1==0)

       {

              sleep(1);

              for(i=0;i<3;i++)

              {

                     tprintf("Hellofrom child NO.1 process %d. %d times\n",getpid(),i+1);

                     sleep(1);

              }

              return 0;

       }

 

       pid2=fork();

      

       if(pid2==0)

       {

              sleep(1);

              for(i=0;i<3;i++)

              {

                     tprintf("Hellofrom child NO.2  process %d. %dtimes\n",getpid(),i+1);

                     sleep(1);

              }

              return 0;

       }

       else if(pid1!=-1)
       {

              tprintf("parentforked one child pross--%d.\n",pid1);

              tprintf("parentforked one child pross--%d.\n",pid2);

              tprintf("parentis waiting for child exit .\n");

              waitpid(pid1,NULL,0);

              tprintf("childNO.1 process had exited .\n");

 

              waitpid(pid2,NULL,0); 

              tprintf("childNO.2 process had exited .\n");

 

              tprintf("parentprocess had exited .\n");

       }

       else
       {
              tprintf("every thing was done withouterror.\n");}
              return 0;

}

 

int tprintf (const char *fnt,...)

{

       va_list args;

       struct tm *tstruct;

       time_t tsec;

       tsec=time(NULL);

       tstruct=localtime(&tsec);

       printf("%02d:%02d:%02d:%5d|",tstruct->tm_hour,tstruct->tm_min,tstruct->tm_sec,getpid());

       va_start(args,fnt);

       return vprintf(fnt,args);

}