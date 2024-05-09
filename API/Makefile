ifneq (,$(wildcard ./.env))
    include .env
    export
endif

current_dir := $(dir $(realpath $(firstword $(MAKEFILE_LIST))))
IMAGE = university/optimize-be

build-local:
	@docker build -t $(IMAGE):latest -f ./Dockerfile --no-cache .
local-export:
	@docker save $(IMAGE):latest -o be.tar