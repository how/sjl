/**
 * ====================================================================
 * About
 * ====================================================================
 * Sarissa cross browser XML library - IE XSLT Emulation (deprecated)
 * @version ${project.version}
 * @author: Manos Batsis, mailto: mbatsis at users full stop sourceforge full stop net
 *
 * This script emulates Internet Explorer's transformNode and transformNodeToObject
 * for Mozilla and provides a common way to set XSLT parameters
 * via Sarissa.setXslParameter.
 *
 * All functionality in this file is DEPRECATED, the XSLTProcessor
 * should be used instead.
 *
 * ====================================================================
 * Licence
 * ====================================================================
 * Sarissa is free software distributed under the GNU GPL version 2 (see <a href="gpl.txt">gpl.txt</a>) or higher, 
 * GNU LGPL version 2.1 (see <a href="lgpl.txt">lgpl.txt</a>) or higher and Apache Software License 2.0 or higher 
 * (see <a href="asl.txt">asl.txt</a>). This means you can choose one of the three and use that if you like. If 
 * you make modifications under the ASL, i would appreciate it if you submitted those.
 * In case your copy of Sarissa does not include the license texts, you may find
 * them online in various formats at <a href="http://www.gnu.org">http://www.gnu.org</a> and 
 * <a href="http://www.apache.org">http://www.apache.org</a>.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY 
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
 * WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE 
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
if(!Sarissa.IS_ENABLED_TRANSFORM_NODE && window.XSLTProcessor && self.XMLElement){
    /** 
     * <p><b>Deprecated, will be removed in 0.9.6 (use XSLTProcessor instead): </b>Extends the Element class to emulate IE's transformNodeToObject (deprecated).
     * <b>Note </b>: The transformation result <i>must </i> be well formed,
     * otherwise an error will be thrown</p>
     * @uses Mozilla's XSLTProcessor  
     * @deprecated use the XSLTProcessor instead
     * @argument xslDoc The stylesheet to use (a DOM Document instance)
     * @argument oResult The Document to store the transformation result
     */
    XMLElement.prototype.transformNodeToObject = function(xslDoc, oResult){
        var oDoc = document.implementation.createDocument("", "", null);
        Sarissa.copyChildNodes(this, oDoc);
        oDoc.transformNodeToObject(xslDoc, oResult);
    };
    /**
     * <p><b>Deprecated, will be removed in 0.9.6 (use XSLTProcessor instead): </b> Extends the Document class to emulate IE's transformNodeToObject (deprecated).</p>
     * @uses Mozilla's XSLTProcessor  
     * @deprecated use the XSLTProcessor instead
     * @argument xslDoc The stylesheet to use (a DOM Document instance)
     * @argument oResult The Document to store the transformation result
     * @throws Errors that try to be informative
     */
    Document.prototype.transformNodeToObject = function(xslDoc, oResult){
        var xsltProcessor = null;
        try{
            xsltProcessor = new XSLTProcessor();
            if(xsltProcessor.reset){
                /* new nsIXSLTProcessor is available */
                xsltProcessor.importStylesheet(xslDoc);
                var newFragment = xsltProcessor.transformToFragment(this, oResult);
                Sarissa.copyChildNodes(newFragment, oResult);
            }else{
                /* only nsIXSLTProcessorObsolete is available */
                xsltProcessor.transformDocument(this, xslDoc, oResult, null);
            };
        }catch(e){
            if(xslDoc && oResult)
                throw "Failed to transform document. (original exception: "+e+")";
            else if(!xslDoc)
                throw "No Stylesheet Document was provided. (original exception: "+e+")";
            else if(!oResult)
                throw "No Result Document was provided. (original exception: "+e+")";
            else if(xsltProcessor == null)
                throw "Could not instantiate an XSLTProcessor object. (original exception: "+e+")";
            else
                throw e;
        };
    };
    /**
     * <p><b>Deprecated, will be removed in 0.9.6 (use XSLTProcessor instead): </b>Extends the Element class to emulate IE's transformNode (deprecated). </p>
     * <p><b>Note </b>: The result of your transformation must be well formed,
     * otherwise you will get an error</p>. 
     * @uses Mozilla's XSLTProcessor    
     * @deprecated use the XSLTProcessor instead
     * @argument xslDoc The stylesheet to use (a DOM Document instance)
     * @returns the result of the transformation serialized to an XML String
     */
    XMLElement.prototype.transformNode = function(xslDoc){
        var oDoc = document.implementation.createDocument("", "", null);
        Sarissa.copyChildNodes(this, oDoc);
        return oDoc.transformNode(xslDoc);
    };
    /**
     * <p><b>Deprecated, will be removed in 0.9.6 (use XSLTProcessor instead): </b>Extends the Document class to emulate IE's transformNode (deprecated).</p>
     * <p><b>Note </b>: The result of your transformation must be well formed,
     * otherwise you will get an error</p>
     * @uses Mozilla's XSLTProcessor
     * @deprecated use the XSLTProcessor instead
     * @argument xslDoc The stylesheet to use (a DOM Document instance)
     * @returns the result of the transformation serialized to an XML String
     */
    Document.prototype.transformNode = function(xslDoc){
        var out = document.implementation.createDocument("", "", null);
        this.transformNodeToObject(xslDoc, out);
        var str = null;
        try{
            var serializer = new XMLSerializer();
            str = serializer.serializeToString(out);
        }catch(e){
            throw "Failed to serialize result document. (original exception: "+e+")";
        };
        return str;
    };
    Sarissa.IS_ENABLED_TRANSFORM_NODE = true;
};
/**
 * <p>Deprecated (use XSLTProcessor instead): Set xslt parameters.</p>
 * <p><b>Note </b> that this method can only work for the main stylesheet and not any included/imported files.</p>
 * @deprecated use the XSLTProcessor instead
 * @argument oXslDoc the target XSLT DOM Document
 * @argument sParamName the name of the XSLT parameter
 * @argument sParamValue the value of the XSLT parameter
 * @returns whether the parameter was set succefully
 */
Sarissa.setXslParameter = function(oXslDoc, sParamQName, sParamValue){
    try{
        var params = oXslDoc.getElementsByTagName(_SARISSA_IEPREFIX4XSLPARAM+"param");
        var iLength = params.length;
        var bFound = false;
        var param;
        if(sParamValue){
            for(var i=0; i < iLength && !bFound;i++){
                if(params[i].getAttribute("name") == sParamQName){
                        param = params[i];
                    while(param.firstChild)
                        param.removeChild(param.firstChild);
                    if(!sParamValue || sParamValue == null){
                    }else if(typeof sParamValue == "string"){ 
                        param.setAttribute("select", sParamValue);
                        bFound = true;
                    }else if(sParamValue.nodeName){
                        param.removeAttribute("select");
                        param.appendChild(sParamValue.cloneNode(true));
                        bFound = true;
                    }else if (sParamValue.item(0) && sParamValue.item(0).nodeType){
                        for(var j=0;j < sParamValue.length;j++)
                            if(sParamValue.item(j).nodeType)
                                param.appendChild(sParamValue.item(j).cloneNode(true));
                        bFound = true;
                    }else
                        throw "Failed to set xsl:param "+sParamQName+" (original exception: "+e+")";
                };
            };
        };
        return bFound;
    }catch(e){
        throw e;
        return false;
    };
};
