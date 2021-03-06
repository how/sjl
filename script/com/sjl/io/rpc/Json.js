/**
 * Standard JavaScript Library
 *
 * LICENSE
 *
 * This source file is subject to the sjl Public License license that
 * is bundled with this package in the file LICENSE.txt.
 *
 * @license http://www.opensource.org/licenses/bsd-license.php New BSD License
 * @copyright Copyright (c) 2008, Danny Graham, Scott Thundercloud
 */

Namespace("com.sjl.io.data");

/**
 * Attaches the methods from com.sjl.io.RPC to this
 * @class JSON Class
 * @constructor
 * @author Scott Thundercloud
 */
com.sjl.io.data.Json = Class.create();
com.sjl.io.data.Json.prototype.initialize = function(smd)
{
	var rpc = new com.sjl.io.Http.RPC(smd);
	this.createMethods(rpc.newFuncs);
}

com.sjl.io.data.Json.prototype.createMethods = function(newFuncs)
{
	for(var i=0; i < newFuncs.length; i++)
	{
		var methodName = newFuncs[i].methodName;
		var method = newFuncs[i].method;
		this[methodName] = method;
	}
}

com.sjl.io.data.Json.prototype.runMethod = function()
{
	return null;
}