function initialize()
{
    var buildString;
    var __num;

    for( t = 0; t < size[0]; t++ )
        for( r = 0; r < size[1]; r++ )
        {
            __num = t * size[0] + r;

            buildString =
                "<Transform DEF = '" + id + "Transform" + __num + "' translation = '" + t.toString() + " 0 " + r.toString() + "'> \
                    <Shape DEF = '" + id + "Shape" + __num + "'> \
                        <Appearance> \
                            <Material diffuseColor = '1 1 1'/> \
                            <ImageTexture url = 'textures/floor.png'/> \
                        </Appearance> \
                        <Box DEF = '" + id + "Box" + __num + "' size = '0.9 0.01 0.9'/> \
                    </Shape> \
                </Transform>";
            
            Browser.currentScene.updateNamedNode( id + "Transform" + __num, SFNode(buildString) );

            collection[__num] = Browser.currentScene.getNamedNode(id + "Transform" + __num);

            Browser.currentScene.getNamedNode("dynamic").addChild( collection[__num] );
        }

    print( "Hey! I'm the board initializer" );

    finished = true;
}

function wake( /*SFString*/ trig )
{
    print( id + " has been woken up" );
}