/**
 * Author: Jeffer Calhoun
 * Course: CS 4280 (5:30-6:45PM)
 * Date: 04/22/17
 **/
#ifndef SEMSTACK_H
#define SEMSTACK_H

#include <string>

using namespace std;

class SVT{

	private:
		string* stackArr;
		int stackSize;
		int top;

	public:
		SVT();

		void push(string);
		void pop();
		int find(String);
};

#endif