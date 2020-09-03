function initialize()
{
    var buildString = 
        "<Transform rotation = '1 0 0 3.14' translation = '" + position.toString() + "'> \
            <Shape DEF = '" + id + "Shape" + "'> \
                <Appearance> \
                    <Material diffuseColor = '0.1 0.1 0.4' specularColor = '0.7 0.7 0.5'/> \
                </Appearance> \
                <Cone DEF = '" + id + "Cone" + "' height = '0.35' bottomRadius = '0.1'/> \
            </Shape> \
            <SpotLight intensity = '1' color = '0.5 0.5 0.9' direction = '0 1 0' beamWidth = 'pi/4'/> \
        </Transform>";

    Browser.currentScene.updateNamedNode( id + "Transform", SFNode(buildString) );
    Browser.currentScene.getNamedNode("dynamic").addChild( Browser.currentScene.getNamedNode(id + "Transform") );

    print( "Hey! I'm the selector initializer" );
}

function wake( /*SFString*/ trig )
{
    print( id + " has been woken up" );
}

function changePos( /*SFVec3f*/ newPos )
{
    Browser.currentScene.getNamedNode(id + "Transform").translation = newPos;
}

function show( /*SFBool*/ yes )
{
    if( yes )
    {
        Browser.currentScene.getNamedNode(id + "Transform").scale = SFVec3f(1, 1, 1);
        print( id + " shown" );
    }
    else
    {
        Browser.currentScene.getNamedNode(id + "Transform").scale = SFVec3f(0, 0, 0);
        print( id + " hidden" );
    }
}