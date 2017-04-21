all: abi bin

bin: *.sol
	solc --bin -o build *.sol

abi: *.sol
	solc --abi -o abidir *.sol

clean: 
	rm -rf ./build/*.bin ./abidir/*.abi
