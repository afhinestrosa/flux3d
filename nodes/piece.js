const Y_AXIS = 1;

function initialize()
{
    this.height = 0.5;
    scale = 1;
    var __pos = position;

    __pos[Y_AXIS] += this.height / 2;

    var buildString = 
        "<Transform DEF = '" + id + "Transform' translation = '" + __pos.toString() + "'> \
            <Shape DEF = '" + id + "Shape" + "'> \
                <Appearance> \
                    <Material DEF = '" + id + "Material' diffuseColor = '" + color.toString() + "' specularColor = '0.6 0.6 0.2'/> \
                </Appearance> \
                <Cylinder DEF = '" + id + "Cylinder" + "' height = '" + this.height + "' radius = '0.4'/> \
            </Shape> \
        </Transform>";

    Browser.currentScene.updateNamedNode( id + "Transform", SFNode(buildString) );
    Browser.currentScene.getNamedNode("dynamic").addChild( Browser.currentScene.getNamedNode(id + "Transform") );
    Browser.addRoute( Browser.currentScene.getNamedNode(id), 'ready', Browser.currentScene.getNamedNode("game"), 'move' );

    print( "Hey! I'm the piece initializer" );
}

function wake( /*SFString*/ trig )
{
    print( id + " has been woken up" );
}

function resize( /*SFFloat*/ frac )
{
    var __node = Browser.currentScene.getNamedNode(id + "Transform");

    scale += frac;
    __node.scale[Y_AXIS] = scale;
    __node.translation[Y_AXIS] = (__node.scale[Y_AXIS] * this.height) / 2;

    if( __node.scale[Y_AXIS] <= 0 )
    {
        remove( true );
    }

    ready = true;
}

function remove( /*SFBool*/ trig )
{
    if( trig )
    {
        Browser.currentScene.getNamedNode("dynamic").removeChild( Browser.currentScene.getNamedNode(id + "Transform") );
    }
}

function restore( /*SFFloat*/ frac )
{
    var __node = Browser.currentScene.getNamedNode(id + "Transform");

    scale = frac;
    __node.scale[Y_AXIS] = scale;
    __node.translation[Y_AXIS] = (__node.scale[Y_AXIS] * this.height) / 2;
}