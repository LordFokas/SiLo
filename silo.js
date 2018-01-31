var SiLo = (function(){
	var language = null, fallback = null, cache = null, functions = null, warn_fallback = null, warn_no_key = null, warn_no_func = null;

	function replace_all(s, t, r){ return s.split(t).join(r); }
	function tree_find(keys, def, idx, obj){ ret = obj[keys[idx++]]; return ret ? (idx == keys.length ? ret : tree_find(keys, def, idx, ret)) : def; }
	function callback(func, warn, param, full){ if(func) func(warn, param, full); }
	function localizable(element){ return element.dataset && element.dataset.siloKey; } // Silo Key? Sounds dangerous :o
	function push_localizables(element, elements){ if(localizable(element)) elements.push(element); for(idx in element.children) push_localizables(element.children[idx], elements); }

	function localize(elements){
		if(language || fallback){
			for(idx in elements){
				var element = elements[idx];
				if(localizable(element)){
					var data = element.dataset.siloKey.split(':'); // really tempted to use [func, key] = (...) here
					var keys = data[1].split('.');
					var str = tree_find(keys, data[1], 0, language || {});
					if(str === data[1] && fallback){
						str = tree_find(keys, data[1], 0, fallback || {});
						if(str !== data[1]) callback(warn_fallback, "warn_fallback", data[1], element.dataset.siloKey);
					}
					if(str === data[1]){
						callback(warn_no_key, "warn_no_key", data[1], element.dataset.siloKey);
					}else if(functions[data[0]]){
						functions[data[0]](element, str);
					}else{
						callback(warn_no_func, "warn_no_func", data[0], element.dataset.siloKey);
					}
				}
			}
		}
	}

	function func_string(element, str){ element.innerHTML = str; }
	function func_text(element, str){ func_string(element, replace_all(str, '\n', '<br />')); }
	function func_tooltip(element, str){ element.title = str; }
	function func_hint(element, str){ element.placeholder = str; }
	function func_value(element, str){ element.value = str; }

	functions = {
		string: func_string,
		text: func_text,
		tooltip: func_tooltip,
		hint: func_hint,
		value: func_value
	};

	// public interface -- here be rockets
	function localize_all(){ localize_recursive(document.body); }
	function localize_recursive(element){ var elements = []; push_localizables(element, elements); localize(elements); }
	function localize_class(className){ localize(document.getElementsByClassName(className)); }

	function language_load(dictionary, makeFallback){ language = dictionary; if(makeFallback) fallback = dictionary; }
	function language_cache(code, loader, makeFallback){
		var callback = function(dict){
			if(!cache[code]) cache[code] = dict;
			language = cache[code];
			if(makeFallback) fallback = cache[code];
		}
		if(!cache[code]) loader(code, callback);
		else callback();
	}

	function functions_all(){ return functions; }
	function functions_add(key, func){ functions[key] = func; }
	function functions_remove(key){ delete functions[key]; }
	function functions_clear(){ functions = {}; }

	function warnings_all(func){ warn_fallback = warn_no_key = warn_no_func = func; }
	function warnings_fallback(func){ warn_fallback = func; }
	function warnings_no_key(func){ warn_no_key = func; }
	function warnings_no_function(func){ warn_no_func = func; }

	return {
		localize:  { all: localize_all, recursive: localize_recursive, class: localize_class },
		language:  { load: language_load, cache: language_cache },
		functions: { all: functions_all, add: functions_add, remove: functions_remove, clear: functions_clear },
		warnings:  { all: warnings_all, fallback: warnings_fallback, no_key: warnings_no_key, no_function: warnings_no_function }
    };
})();