
//	Insert one path string into recursive data structure...
function _datify_one_path(oo, path)
{
	var dct = oo.RDATA;

        //      iterate nodes in path...
        for (var j=0;j<path.length;j++)
        {
		key = path[j];
		if ( key in dct )
                {
			// this node exists...
			dct = dct[key];
                        continue;
                }
                else
                {
                        dct[key] = {}
                        dct = dct[key];
                }
        }
}

//	Insert all path strings into a recursive data structure
function _datify(oo)
{
	var lines = oo.strings;
	for (var i=0;i<lines.length;i++)
        {
        	var line = lines[i];
                var parts = line.split(",");
                _datify_one_path( oo, parts );
        }
}

//	Create jstree nodes recursively...
function _recurse(dct, parent, path)
{
	var ul = document.createElement('ul');
        ul.id = "ul__" + path;
        parent.appendChild(ul)

        for (var key in dct)
        {
        	var li = document.createElement('li');
                li.id = path + "_" + key;
                li.className="jstree-open";
                ul.appendChild(li)

                var a = document.createElement('a');
                a.setAttribute('href','#');
                a.innerHTML = key;
                li.appendChild(a);

                var obj = dct[key];

                if ( Object.prototype.toString.call( obj ) == "[object Object]" )
                {
                	_recurse( obj, li, path + "_" + key );
                }
        }
}

//	Create the jstree...
function _treeify(oo)
{
	var parent = document.getElementById(oo.parent);
        var d = document.createElement('div');
        d.id = "starview_tree";
        parent.appendChild(d);

        _recurse( oo.RDATA, d, "");

        $(function () {
                          $("#starview_tree")
                               .jstree({
					"themes" : {
            						"theme" : "classic",
            						"dots" : false,
            						"icons" : false
        					   },
					"core" : {
						"initially_open":[]
						},
					"plugins" : ["core","themes","html_data","ui"] })
                               
				// 1) if using the UI plugin bind to select_node
                               .bind("select_node.jstree", 
					function (event, data) 
					{
                               			// `data.rslt.obj` is the jquery extended node that was clicked
                               			oo.click(data.rslt.obj.attr("id"));
                               			//alert(data.rslt.obj.attr("id"));
                      			})

                      		// 2) if not using the UI plugin - the Anchor tags work as expected
                      		//    so if the anchor has a HREF attirbute - the page will be changed
                      		//    you can actually prevent the default, etc (normal jquery usage)
                      		.delegate("a", "click", function (event, data) 
							{ event.preventDefault(); });

				setTimeout(function () { $("#starview_tree").jstree("close_all"); }, 1);



        });
		
         
}


//	Object constructor...
function starview_tree(parent, init, click)
{
	this.parent = parent;
	this.init = init;
	this.click = click;
	this.RDATA = {};

	//	get init data...
	this.strings = this.init();

	//	convert strings to recursive data structure...	
	_datify(this);

	//	convert recursive data structure to jstree...
        _treeify(this);
}


