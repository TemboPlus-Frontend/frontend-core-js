# Makefile for publishing @temboplus/frontend-core to npm
# This package is built using Deno

# Variables
VERSION ?= 0.2.2
NPM_DIR = npm
JSR_PACKAGE_NAME = @temboplus/frontend-core

# Test command
TEST_CMD = deno test -A

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make test                 - Run all tests"
	@echo "  make build VERSION=x.y.z  - Run tests and build the npm package with specified version"
	@echo "  make publish              - Publish the package to npm"
	@echo "  make deploy-jsr           - Deploy the package to JSR"
	@echo "  make release VERSION=x.y.z - Run tests, build and publish to npm in one step"
	@echo "  make release-all VERSION=x.y.z - Run tests, build, publish to npm, and deploy to JSR"
	@echo "  make clean                - Remove the npm directory"
	@echo ""
	@echo "Example:"
	@echo "  make test"
	@echo "  make release VERSION=0.2.0"
	@echo "  make deploy-jsr"
	@echo "  make release-all VERSION=0.2.0"

# Run tests
.PHONY: test
test:
	@echo "Running tests..."
	$(TEST_CMD)
	@echo "All tests passed successfully!"

# Build the npm package
.PHONY: build
build: test
	@echo "Building npm package version $(VERSION)..."
	deno run -A scripts/build_npm.ts $(VERSION)
	@echo "Build complete. Package is ready in the npm directory."

# Publish to npm
.PHONY: publish
publish:
	@echo "Publishing to npm..."
	cd $(NPM_DIR) && npm publish --access=public
	@echo "Package published successfully!"

# Deploy to JSR (JavaScript Registry)
.PHONY: deploy-jsr
deploy-jsr:
	@echo "Deploying to JSR..."
	deno publish --allow-slow-types
	@echo "Package deployed to JSR successfully!"

# Build and publish to npm in one step
.PHONY: release
release: build publish

# Build and publish to both npm and JSR in one step
.PHONY: release-all
release-all: build publish deploy-jsr

# Clean up
.PHONY: clean
clean:
	@echo "Cleaning up..."
	rm -rf $(NPM_DIR)
	@echo "Cleanup complete."