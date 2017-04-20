all: abi bin

bin: *.sol
	solc --bin -o build *.sol

abi: *.sol
	solc --abi -o abi *.sol

clean: 
	rm -rf ./build/*.bin ./abi/*.abi
