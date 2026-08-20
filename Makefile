OST ?= localhost
PORT ?= 4500
LOG_FILE = /tmp/jekyll$(PORT).log
PYTHON := venv/bin/python3

SHELL = /bin/bash -c
.SHELLFLAGS = -e

# Phony Targets, makefile housekeeping for below definitions
.PHONY: default server issues convert clean stop force

# List all .ipynb files in the _notebooks directory
NOTEBOOK_FILES := $(shell find _notebooks -name '*.ipynb')
CSP_NOTEBOOK_FILES := $(shell find _notebooks/CSP -name '*.ipynb' 2>/dev/null || true)

# Specify the target directory for the converted Markdown files
DESTINATION_DIRECTORY = _posts
MARKDOWN_FILES := $(patsubst _notebooks/%.ipynb,$(DESTINATION_DIRECTORY)/%_IPYNB_2_.md,$(NOTEBOOK_FILES))

###########################################
# Project Selection Logic
###########################################

# Call server, then verify and start logging
default: server
	@echo "Terminal logging starting, watching server..."
	@# tail and awk work together to extract Jekyll regeneration messages
	@# When a _notebook is detected in the log, call make convert in the background
	@# Note: We use the "if ($$0 ~ /_notebooks\/.*\.ipynb/) { system(\"make convert &\") }" to call make convert
	@(tail -f $(LOG_FILE) | awk '/Server address: http:\/\/localhost:$(PORT)\/$(REPO_NAME)\// { serverReady=1 } \
	serverReady && /^ *Regenerating:/ { regenerate=1 } \
	regenerate { \
		if (/^[[:blank:]]*$$/) { regenerate=0 } \
		else { \
			print; \
			if ($$0 ~ /_notebooks\/.*\.ipynb/) { system("make convert &") } \
		} \
	}') 2>/dev/null &
	@# start an infinite loop with timeout to check log status
	@for ((COUNTER = 0; ; COUNTER++)); do \
		if grep -q "Server address:" $(LOG_FILE); then \
			echo ""; \
			echo "Server started in $$COUNTER seconds"; \
			break; \
		fi; \
		if [ $$COUNTER -eq 300 ]; then \
			echo ""; \
			echo "Server timed out after $$COUNTER seconds."; \
			echo "Review errors from $(LOG_FILE)."; \
			cat $(LOG_FILE); \
			exit 1; \
		fi; \
		printf "\rStill starting... (%ds elapsed)" $$COUNTER; \
		sleep 1; \
	done

csp: cspserver
	@echo "ONLY COMPILED CSP CONTENT"
	@echo "Terminal logging starting, watching server..."
	@# tail and awk work together to extract Jekyll regeneration messages
	@# When a _notebook is detected in the log, call make convert in the background
	@# Note: We use the "if ($$0 ~ /_notebooks\/.*\.ipynb/) { system(\"make convert &\") }" to call make convert
	@(tail -f $(LOG_FILE) | awk '/Server address: http:\/\/localhost:$(PORT)\/$(REPO_NAME)\// { serverReady=1 } \
	serverReady && /^ *Regenerating:/ { regenerate=1 } \
	regenerate { \
		if (/^[[:blank:]]*$$/) { regenerate=0 } \
		else { \
			print; \
			if ($$0 ~ /_notebooks\/CSP\/.*\.ipynb/) { system("make convert &") } \
		} \
	}') 2>/dev/null &
	@# start an infinite loop with timeout to check log status
	@for ((COUNTER = 0; ; COUNTER++)); do \
		if grep -q "Server address:" $(LOG_FILE); then \
			echo ""; \
			echo "Server started in $$COUNTER seconds"; \
			break; \
		fi; \
		if [ $$COUNTER -eq 300 ]; then \
			echo ""; \
			echo "Server timed out after $$COUNTER seconds."; \
			echo "Review errors from $(LOG_FILE)."; \
			cat $(LOG_FILE); \
			exit 1; \
		fi; \
		printf "\rStill starting... (%ds elapsed)" $$COUNTER; \
		sleep 1; \
	done
	@# outputs startup log, removes last line ($$d) as ctl-c message is not applicable for background process
	@sed '$$d' $(LOG_FILE)

use-cayman:
	@echo "Switching to Cayman theme..."
	@cp _themes/cayman/_config.yml _config.yml
	@cp _themes/cayman/Gemfile Gemfile
	@cp _themes/cayman/opencs.html _layouts/opencs.html
	@cp _themes/cayman/page.html _layouts/page.html
	@cp _themes/cayman/post.html _layouts/post.html
	@$(PYTHON) scripts/update_color_map.py cayman || echo "⚠ Color map update failed, continuing..."
	@echo "✓ Cayman theme activated"

# Start the local web server
server: stop convert
	@echo "Starting server..."
	@@nohup bundle exec jekyll serve -H localhost -P $(PORT) > $(LOG_FILE) 2>&1 & \
		PID=$$!; \
		echo "Server PID: $$PID"
	@@until [ -f $(LOG_FILE) ]; do sleep 1; done

cspserver: stop cspconvert
	@echo "Starting server..."
	@@nohup bundle exec jekyll serve -H localhost -P $(PORT) > $(LOG_FILE) 2>&1 & \
		PID=$$!; \
		echo "Server PID: $$PID"
	@@until [ -f $(LOG_FILE) ]; do sleep 1; done

use-yat:
	@cp _themes/yat/_config.yml _config.yml
	@cp _themes/yat/Gemfile Gemfile
	@cp _themes/yat/opencs.html _layouts/opencs.html
	@cp _themes/yat/page.html _layouts/page.html
	@cp _themes/yat/post.html _layouts/post.html

serve-hydejack: use-hydejack clean
	@make serve-current

build-tactile: use-tactile build-current

# Serve with selected theme
serve-minima: use-minima clean
	@make serve-current

serve-text: use-text clean
	@make serve-current

serve-cayman: use-cayman clean
	@make serve-current

serve-so-simple: use-so-simple clean
	@make serve-current

serve-yat: use-yat clean
	@make serve-current

###########################################
# Project Targets
###########################################

# Build all registered projects (game assets, not docs)
build-registered-projects:
	$(call run_projects,$(ALL_PROJECTS),Building,build)

build-dev-projects:
	@echo "Active DEV Projects: $(ACTIVE_DEV_PROJECTS)"
	$(call run_projects,$(ACTIVE_DEV_PROJECTS),Building,build)

# Convert notebooks for dev projects only (dev mode initial build)
convert-registered-notebooks:
	@if [ -f _projects/.makeprojects ]; then \
		for proj in $(ACTIVE_DEV_PROJECTS); do \
			proj_name=$$(basename $$proj); \
			if [ -d "_notebooks/projects/$$proj_name" ]; then \
				find "_notebooks/projects/$$proj_name" -name '*.ipynb' 2>/dev/null | while read notebook; do \
					make convert-single NOTEBOOK_FILE="$$notebook" 2>&1; \
				done; \
			fi; \
		done; \
	fi

# Build documentation for all registered projects (serve mode only)
build-registered-docs:
	$(call run_projects,$(ALL_PROJECTS),Docs,docs)

# Watch all registered projects for changes (dev mode)
watch-registered-projects:
	$(call run_projects,$(ALL_PROJECTS),Watching,watch)

watch-dev-projects:
	$(call run_projects,$(ACTIVE_DEV_PROJECTS),Watching,watch)

# Clean all registered project distributions
clean-registered-projects:
	$(call run_projects,$(ALL_PROJECTS),Cleaning,clean)
	$(call run_projects,$(ALL_PROJECTS),Cleaning docs,docs-clean)

# General serve target (uses whatever is in _config.yml/Gemfile)
serve-current: stop build-registered-projects convert split-courses build-registered-docs jekyll-serve

# Build with selected theme
build-minima: use-minima build-current
build-text: use-text build-current
build-cayman: use-cayman build-current
build-so-simple: use-so-simple build-current
build-yat: use-yat build-current

build-current: clean convert split-courses
	@bundle install
	@bundle exec jekyll clean
	@bundle exec jekyll build

# General serve/build for whatever is current
serve: serve-current
build: build-current

# Multi-course file splitting
split-courses:
	@echo " ------ Splitting multi-course files... -------"
	@python3 scripts/split_multi_course_files.py

clean-courses:
	@echo "🧹Cleaning course-specific files..."
	@python3 scripts/split_multi_course_files.py clean

# Notebook and DOCX conversion
convert: $(MARKDOWN_FILES) convert-docx
$(DESTINATION_DIRECTORY)/%_IPYNB_2_.md: _notebooks/%.ipynb
	@mkdir -p $(@D)
	@$(PYTHON) -c "from scripts.convert_notebooks import convert_notebooks; convert_notebooks()"

# Single notebook conversion (faster for development)
convert-single:
	@if [ -z "$(NOTEBOOK_FILE)" ]; then \
		echo "Error: NOTEBOOK_FILE variable not set"; \
		exit 1; \
	fi
	@echo "Converting: $(NOTEBOOK_FILE)"
	@$(PYTHON) scripts/convert_notebooks.py "$(NOTEBOOK_FILE)"

# DOCX conversion
convert-docx:
	@if [ -d "_docx" ] && [ "$(shell ls -A _docx 2>/dev/null)" ]; then \
		$(PYTHON) scripts/convert_docx.py; \
	else \
		echo "No DOCX files found in _docx directory"; \
	fi

# DOCX conversion for specific config change
convert-docx-config:
	@if [ -d "_docx" ] && [ "$(shell ls -A _docx 2>/dev/null)" ]; then \
		if [ -n "$(CONFIG_FILE)" ]; then \
			echo "🔧 Config file changed: $(CONFIG_FILE)"; \
			$(PYTHON) scripts/convert_docx.py --config-changed "$(CONFIG_FILE)"; \
		else \
			$(PYTHON) scripts/convert_docx.py; \
		fi; \
	else \
		echo "No DOCX files found in _docx directory"; \
	fi

# Clean only DOCX-converted files (safe)
clean-docx:
	@echo "Cleaning DOCX-converted files..."
	@find _posts -type f -name '*_DOCX_.md' -exec rm {} + 2>/dev/null || true
	@echo "Cleaning extracted DOCX images..."
	@rm -rf images/docx/*.png images/docx/*.jpg images/docx/*.jpeg images/docx/*.gif 2>/dev/null || true
	@echo "Cleaning DOCX index page..."
	@rm -f docx-index.md 2>/dev/null || true
	@echo "DOCX cleanup complete"

clean: stop
	@echo "Cleaning converted IPYNB files..."
	@find _posts -type f -name '*_IPYNB_2_.md' -exec rm {} +
	@echo "Cleaning Github Issue files..."
	@find _posts -type f -name '*_GithubIssue_.md' -exec rm {} +
	@echo "Cleaning converted DOCX files..."
	@find _posts -type f -name '*_DOCX_.md' -exec rm {} + 2>/dev/null || true
	@echo "Cleaning course-specific files..."
	@make clean-courses || true
	@echo "Cleaning project distributions..."
	@make clean-registered-projects
	@echo "Cleaning extracted DOCX images..."
	@rm -rf images/docx/*.png images/docx/*.jpg images/docx/*.jpeg images/docx/*.gif 2>/dev/null || true
	@echo "Cleaning DOCX index page..."
	@rm -f docx-index.md 2>/dev/null || true
	@echo "Removing empty directories in _posts..."
	@while [ $$(find _posts -type d -empty | wc -l) -gt 0 ]; do \
		find _posts -type d -empty -exec rmdir {} +; \
	done
	@echo "Removing _site directory..."
	@rm -rf _site
	@echo "Cleaning auto-generated Makefiles..."
	@find _projects -name "Makefile" ! -path "*/_template/*" -type f -exec rm {} +

stop:
	@echo "Stopping server..."
	@@lsof -ti :$(PORT) | xargs kill >/dev/null 2>&1 || true
	@echo "Stopping logging process..."
	@@ps aux | awk -v log_file=$(LOG_FILE) '$$0 ~ "tail -f " log_file { print $$2 }' | xargs kill >/dev/null 2>&1 || true
	@echo "Stopping notebook watcher..."
	@@ps aux | grep "watch-rebuild" | grep -v grep | awk '{print $$2}' | xargs kill >/dev/null 2>&1 || true
	@@ps aux | grep "watch-notebooks" | grep -v grep | awk '{print $$2}' | xargs kill >/dev/null 2>&1 || true
	@@ps aux | grep "watch-projects" | grep -v grep | awk '{print $$2}' | xargs kill >/dev/null 2>&1 || true
	@@ps aux | grep "find _notebooks" | grep -v grep | awk '{print $$2}' | xargs kill >/dev/null 2>&1 || true
	@echo "Stopping project watchers..."
	@@ps aux | grep "make -C _projects" | grep -v grep | awk '{print $$2}' | xargs kill >/dev/null 2>&1 || true
	@rm -f $(LOG_FILE) /tmp/.notebook_watch_marker /tmp/.project_watch_marker /tmp/.jekyll_regenerating /tmp/.jekyll_rebuild_trigger /tmp/.jekyll_rebuild_done /tmp/.jekyll_rebuild_log
	@rm -f /tmp/.project_*_marker 2>/dev/null || true

reload:
	@make stop
	@make

refresh:
	@make stop
	@make clean
	@make

# force kills all related processes and restarts
force:
	@echo "Force stopping all jekyll and bundle processes..."
	@pkill -9 -f "jekyll" 2>/dev/null || true
	@pkill -9 -f "bundle exec" 2>/dev/null || true
	@@lsof -ti :$(PORT) | xargs kill -9 >/dev/null 2>&1 || true
	@rm -f $(LOG_FILE)
	@echo "Force start..."
	@make
