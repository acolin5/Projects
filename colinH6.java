// CSUN Fall 22 COMP182 Hwk-6   heap sort   
import java.util.*;
import java.io.*;

public class colinH6 {
    protected int arr[]; 	
		
	//use prt for System.out to save typing
    PrintStream prt = System.out;

	public static int Powerof2(int a){return (1<<a);}

    // swap arr[m] and arr[n]
	protected void swap(int m, int n){
		int temp = arr[m];
		arr[m] = arr[n];
		arr[n] = temp;
	}
	
    // sort arr[1] thru arr[n] using heap sort 	
    public void heapsort(int n){
		//COMPLETE THIS METHOD
		int j; 
      	for (j = n/2; j>=1; j--); 
      	heapdn(j, n); 
      	for (j=n; j>1; j--){
			swap(1, j); 
      		heapdn(1,j-1);
		}
    } // heapsort	  

	// convert arr[m] thru arr[1] to max heap using heapup
	protected void heapup(int m){
		//COMPLETE THIS METHOD
		while (m > 1 && arr[m] > arr[m/2]){
			swap(m, m/2); 
			m = m/2; 
		}
    } // end heapup


	// convert arr[m] thru arr[n] to max heap using heapdn
	protected void heapdn(int m, int n){
		//COMPLETE THIS METHOD
		while (2 * m  <= n) {
			int j = 2 * m;
			int val = arr[j]; 
			if (j+1 <= n && arr[j+1] < val ) { 
				j = j+1; 
				val = arr[j]; 
			} 
			if (arr[m] < arr[j]) { 
			swap(m, j); 
			 m = j;
			} 
			else{break;}  
		} // end while 
    } // end heapdn
	
	// print arr[] formatted 10 numbers per line
    public void prtarr(int n){
		prt.printf("\n\t(%d):", n);
		for (int i = 1; i <= n; i++) 
			prt.printf("%3d ", arr[i]);
    }

    // print arr[1] thru arr[n] as a CBT level by level	
    public void levelbylevel(int n){
		//COMPLETE THIS METHOD
		int cur = 0;
		int max = Powerof2(cur);
		for(int i=0;i<arr.length;i++){
			if(i==max){
				System.out.print("\n");
				cur++;
				max=Powerof2(cur);
			}
			System.out.print(" "+arr[i]);
		}
    }

   // process method for heap sort
   private void process(int n, int a, int b){ 
      int i, range;
	  prt.print("\n\tHeap sort " +
	  "\n\t\tTo compile: javac colinH6.java" +
		"\n\t\tTo execute: java  colinH6 n a b"+
		"\n\t\t   Example: java  colinH6 20 400 1000");
		
		//Allocate space for arr
		arr =  new int[n+1];
		Random r = new Random();		
		range = b - a + 1;
		for(i=1; i <= n; i++) 
			arr[i] = r.nextInt(range)+a;
		// endfor
		prt.printf("\n\tInput\t");
		prtarr(n); // print arr[]
		
		// Call heapsort
		heapsort(n);
		
		prt.printf("\n\tSorted arr[]");
		prtarr(n); // print arr[]
		
		//Print CBT tree(arr[]) Level by Level
		prt.printf("\n\tCBT Level by Level\n\t");
		levelbylevel(n);
   } //end process method		

  public static void main(String[] args) throws Exception{
		int n, a, b, cnt;
		cnt = args.length; // get no. of atguments
		if (cnt < 3){
		    System.out.printf("\n\tOOOPS Invalid No. of aguments!"+
			"\n\tTO Execute: java colinH6 20 100 200");
			return;
		} // end if	
		
		// get input n, a and b
		n = Integer.parseInt(args[0]);
		a = Integer.parseInt(args[1]);
		b = Integer.parseInt(args[2]);
			
		//System.out.printf("\n fn=%s, array n=%d", fn, n);
		System.out.printf("\n\tcolinH6: n=%d, a=%d, b%d", n, a, b);
			
		// create an instance of colinH6 class
		colinH6 srt = new colinH6();
		
		// call process method 
		srt.process(n, a, b); 
			
		//MAKE SURE TO WRITE YOUR NAME IN NEXT LINE		
		System.out.printf("\n\tAuthor: A. Colin Date: " +
			java.time.LocalDate.now()); 
	}	// end main
}// class colinH6