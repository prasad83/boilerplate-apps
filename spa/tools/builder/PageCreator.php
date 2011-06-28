<?php
/**
 * Copyright: 2011, http://code.google.com/p/boilerplate-apps/
 * License: Apache 2.0
 * Author: Prasad.A
 */
 
// Optimization: Avoid calculation
$__THISDIR__ = dirname(__FILE__);

include_once $__THISDIR__ . '/../../libs/Zend/Json.php';

set_include_path($__THISDIR__. '/../../libs/min/lib' . PATH_SEPARATOR . get_include_path());
include_once 'JSMinPlus.php';
include_once 'Minify/CSS.php';
include_once 'Minify/HTML.php';

include_once $__THISDIR__ . '/../../libs/lessphp/lessc.inc.php';

class PageCreator {
	
	protected $root;
	protected $debug = false;
	protected $basedir;
		
	function __construct($file=null) {
		$this->basedir = dirname(__FILE__) . '/../../';
		
		if ($file) {
			$this->root = simplexml_load_file($file);
		}
	}
	
	function setDebug($debug) {
		$this->debug = $debug;
	}
	
	function setContent($content) {
		$this->root = simplexml_load_string($content);
	}
	
	function build() {
		$this->debug = ($this->attribute($this->root, 'debug') == 'true');
		
		$pagetitle= (string)$this->root->title;
				
		$this->out('<!doctype html>');
		$this->out('<html><head>');
		
		// METAS
		if (isset($this->root->metas->meta)) {
			foreach ($this->root->metas->meta as $meta) {
				$attributes = $meta->attributes();
				$this->out('<meta');
				foreach($attributes as $k => $v) {
					$this->out(sprintf(' %s="%s"', $k, $v));
				}
				$this->out('/>');
			}
		}
		
		$this->out(sprintf('<title>%s</title>', $pagetitle));
		
		// STYLES
		foreach($this->root->styles->style as $style) {
			$this->outStyle($this->attribute($style, 'file'));
		}		
		$this->out('</head><body>');
		
		// BODY
		$this->out(Minify_HTML::minify($this->root->body));
		
		// SCRIPTS
		foreach($this->root->scripts->script as $script) {
			if (!$this->checkIncludeCondition($script)) continue;
			$this->outScript($this->attribute($script, 'file'));
		}
		
		// COMPONENTS
		foreach($this->root->components->component as $component) {
			$this->out('<!-- ' . $this->attribute($component, 'name') . '-->');
			$folder = $this->attribute($component, 'folder');
			
			if (isset($component->classes->class)) {
				foreach($component->classes->class as $class) {
					if (!$this->checkIncludeCondition($class)) continue;
								
					$filepath = $folder . '/' . $this->attribute($class, 'file');
					$this->outScript($filepath);
				}				
			}
			
			if (isset($component->templates->template)) {
				foreach($component->templates->template as $template) {
					if (!$this->checkIncludeCondition($template)) continue;
					
					$this->outTemplate($this->attribute($template, 'name'), $folder . '/' . $this->attribute($template, 'file'));
				}				
			}
			
			if (isset($component->datasources->datasource)) {
				$this->out('<script type="text/javascript">');
				foreach($component->datasources->datasource as $datasource) {
					if (!$this->checkIncludeCondition($datasource)) continue;
					
					$this->outDatasource($this->attribute($datasource, 'name'), $folder . '/' . $this->attribute($datasource, 'file'));
				}
				$this->out('</script>');				
			}
		}
		
		$this->out('</body></html>');		
	}
	
	function checkIncludeCondition($node) {
		$nodeattrs = $node->attributes();						
		// Evaluate condition and include.
		if (isset($nodeattrs['ifdebug']) && strtoupper((string)$nodeattrs['ifdebug']) == 'TRUE' && $this->debug == false) {
			return false;
		}		
		return true;
	}
	
	function outTemplate($name, $filepath) {
		$fullfilepath = $this->basedir . '/' . $filepath;
		
		if (file_exists($fullfilepath)) {
			$this->out(sprintf('<script type="text/x-jstmpl" data-name="%s">%s</script>', 
				$name, Minify_HTML::minify(file_get_contents($fullfilepath))
			));
		}
	}
	
	function outStyle($filepath) {
		
		$less = false;
		if (preg_match('/\.less$/', $filepath)) {
			$less = true;
		}
		
		if ($this->debug) {
			$this->out(sprintf('<link rel="%s" type="text/css" href="%s">', ($less? 'stylesheet/less':'stylesheet'),  $filepath));
		} else {
			$fullfilepath = $this->basedir . '/' . $filepath;
			
			$content = file_get_contents($filepath);
			
			if ($less) {
				// Convert LESS to LESSPHP format...
				$content = preg_replace('/.macro-/', '@macro-', $content);
				$content = preg_replace_callback('/\\([^)]+\\)/', 
					create_function('$matches', 'return str_replace(",", ";", $matches[0]);'), $content);													
								
				$lessCompiler = new lessc();
				$content = $lessCompiler->parse($content);
			}
			
			$this->out('<style type="text/css">');
			$this->out(Minify_CSS::minify($content));
			$this->out('</style>');
		}
	}
	
	function outScript($filepath) {
		$fullfilepath = $this->basedir . '/' . $filepath;
		if (!file_exists($fullfilepath)) {
			$this->out("<!-- FILE NOT FOUND: $filepath -->");
			return;
		}
		
		if ($this->debug) {
			$this->out(sprintf('<script type="text/javascript" src="%s"></script>', $filepath));
		} else {
			$this->out('<script type="text/javascript">');
			if (preg_match("/.min.js/", $fullfilepath)) {
				$this->out(file_get_contents($fullfilepath));
			} else {
				$this->out(JSMinPlus::minify(file_get_contents($fullfilepath)));
			}
			$this->out('</script>');
		}
		
	}
	
	function outDatasource($name, $filepath) {
		
		$this->out(sprintf('Datasource._defn["%s"] = ', $name));
		$fullfilepath = $this->basedir . '/' . $filepath;
		if (!file_exists($fullfilepath)) {
			$this->out("'; /* FILE NOT FOUND: $filepath */'");
			return;
		}
		
		// Hack: Wrap inside function to minify the code
		$content = 'function __(){'. file_get_contents($fullfilepath) .'}';
		$content = JSMinPlus::minify($content);
		$content = substr($content, 14, -1);
		// End
		
		$this->out(Zend_Json::encode($content));
		$this->out(';');
	}
	
	function attribute($node, $name) {
		$attributes = $node->attributes();
		if (isset($attributes[$name])) {
			return (string)$attributes[$name];
		}
		return false;
	}
	
	function out($message) {
		echo $message;
	}
	
}

/** Trigger the action when invoked from command line */
if (php_sapi_name() == 'cli' && $argc > 1) {	
	$pageCreator = new PageCreator($argv[1]);
	$pageCreator->build();
}