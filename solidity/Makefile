all: abi bin

bin: *.sol
	solc --bin -o build *.sol

abi: *.sol
	solc --abi -o build *.sol

clean: 
	rm -rf ./build/*.bin ./build/*.abi
