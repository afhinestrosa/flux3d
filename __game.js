/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BUILDERS                                                                                                                                        //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function pieceBuilder( color, position )
// Piece pseudo-class constructor. A "builder" acts like so: the 'buildString' is an XML hardcoded definition of the object, with some controllable
// values (those passed to the function). After creating the node and adding it to the 'ExecutionContext' object, through the method
// 'updateNamedNode', this code notifies an event from the output 'signal' to be catched by the newly created script. If this is not done, it will
// never execute its 'initialize' method, and so it would be dead.
//
// in  : color    : SFColor : The color for the piece.
// in  : position : SFVec3f : The position for the piece.
// out : return   : SFNode  : A reference to the newly created node.
{
    var __name = decode(color) + PIECE_NAME;

    var buildString =
        "<Script DEF = '" + __name + "' directOutput = 'true' url = 'nodes/piece.js'> \
            <field accessType = 'initializeOnly' name = 'id' type = 'SFString' value = '" + __name + "'/> \
            <field accessType = 'initializeOnly' name = 'color' type = 'SFColor' value = '" + color.toString() + "'/> \
            <field accessType = 'initializeOnly' name = 'position' type = 'SFVec3f' value = '" + position.toString() + "'/> \
            <field accessType = 'inputOutput' name = 'scale' type = 'SFFloat'/> \
            <field accessType = 'inputOnly' name = 'wake' type = 'SFString'/> \
            <field accessType = 'inputOnly' name = 'resize' type = 'SFFloat'/> \
            <field accessType = 'inputOnly' name = 'restore' type = 'SFFloat'/> \
            <field accessType = 'inputOnly' name = 'remove' type = 'SFBool'/> \
            <field accessType = 'outputOnly' name = 'ready' type = 'SFBool'/> \
        </Script>";

    Browser.currentScene.updateNamedNode( __name, SFNode(buildString) );

    Browser.addRoute( Browser.currentScene.getNamedNode("game"), 'signal', Browser.currentScene.getNamedNode(__name), 'wake' );
    signal = __name;

    print( "Hey! I'm the piece builder" );

    return Browser.currentScene.getNamedNode(__name);
}

function selectorBuilder( name, position )
// Selector pseudo-class constructor.
//
// in  : name     : string  : A string identifying the name desired for this script. It can anyways be accessed by calling the 'getNamedNode' method.
// in  : position : SFVec3f : The position for the piece.
// out : return   : SFNode  : A reference to the newly created node.
{
    var buildString =
        "<Script DEF = '" + name + "' directOutput = 'true' url = 'nodes/selector.js'> \
            <field accessType = 'initializeOnly' name = 'id' type = 'SFString' value = '" + name + "'/> \
            <field accessType = 'initializeOnly' name = 'color' type = 'SFColor' value = '0 0 0'/> \
            <field accessType = 'initializeOnly' name = 'position' type = 'SFVec3f' value = '" + position.toString() + "'/> \
            <field accessType = 'inputOnly' name = 'wake' type = 'SFString'/> \
            <field accessType = 'inputOnly' name = 'show' type = 'SFBool'/> \
            <field accessType = 'inputOnly' name = 'changePos' type = 'SFVec3f'/> \
        </Script>";

    Browser.currentScene.updateNamedNode( name, SFNode(buildString) );

    Browser.addRoute( Browser.currentScene.getNamedNode("game"), 'signal', Browser.currentScene.getNamedNode(name), 'wake' );
    signal = name;

    print( "Hey! I'm the selector builder" );

    return Browser.currentScene.getNamedNode(name);
}

function boardBuilder( name, size )
// Board pseudo-class constructor.
//
// in  : name     : string  : A string identifying the name desired for this script. It can anyways be accessed by calling the 'getNamedNode' method.
// in  : position : SFVec3f : The position for the piece.
// out : return   : SFNode  : A reference to the newly created node.
{
    var buildString =
        "<Script DEF = '" + name + "' directOutput = 'true' url = 'nodes/board.js'> \
            <field accessType = 'initializeOnly' name = 'id' type = 'SFString' value = '" + name + "'/> \
            <field accessType = 'initializeOnly' name = 'size' type = 'SFVec2f' value = '" + size.toString() + "'/> \
            <field accessType = 'inputOutput' name = 'collection' type = 'MFNode'/> \
            <field accessType = 'inputOnly' name = 'wake' type = 'SFString'/> \
            <field accessType = 'outputOnly' name = 'finished' type = 'SFBool'/> \
        </Script>";

    Browser.currentScene.updateNamedNode( name, SFNode(buildString) );

    Browser.addRoute( Browser.currentScene.getNamedNode("game"), 'signal', Browser.currentScene.getNamedNode(name), 'wake' );
    Browser.addRoute( Browser.currentScene.getNamedNode(name), 'finished', Browser.currentScene.getNamedNode("game"), 'setup' );
    signal = name;

    print( "Hey! I'm the board builder" );

    return Browser.currentScene.getNamedNode(name);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END BUILDERS                                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// INITIALIZERS                                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addViewpoints()
// Creates different viewpoints for the scene ("Front", "Right" and "Left"). Their names are defined in the CONSTANTS section (Ctrl+F for jumping).
// First, this creates an XML-encoded build string, for simplicity when calling the 'updateNamedNode' method; then, adds it to a 'Group' node. This
// is very important because otherwise these viewpoints would not be available, as they need to be inside a so-called "dynamic group".
{
    var buildString = "";

    buildString =
        "<Viewpoint description = '" + FRONT_VIEWPOINT + "' position = '" + ~~(BOARD_X / 2) + " 2 " + (BOARD_Z * 2 - 1) + "' orientation = '1 0 0 -0.35'/>";

    Browser.currentScene.updateNamedNode( FRONT_VIEWPOINT, SFNode(buildString) );
    Browser.currentScene.getNamedNode("viewpoints").addChild( Browser.currentScene.getNamedNode(FRONT_VIEWPOINT) );

    buildString =
        "<Viewpoint description = '" + RIGHT_VIEWPOINT + "' position = '" + (BOARD_X * 2 - 1) + " 2 " + ~~(BOARD_Z / 2) + "' orientation = '-0 1 0 1.57'/>";

    Browser.currentScene.updateNamedNode( RIGHT_VIEWPOINT, SFNode(buildString) );
    Browser.currentScene.getNamedNode("viewpoints").addChild( Browser.currentScene.getNamedNode(RIGHT_VIEWPOINT) );

    buildString =
        "<Viewpoint description = '" + LEFT_VIEWPOINT + "' position = '" + (-BOARD_X) + " 2 " + ~~(BOARD_Z / 2) + "' orientation = '0 1 0 -1.57'/>";

    Browser.currentScene.updateNamedNode( LEFT_VIEWPOINT, SFNode(buildString) );
    Browser.currentScene.getNamedNode("viewpoints").addChild( Browser.currentScene.getNamedNode(LEFT_VIEWPOINT) );
}

function addAnimation()
// Creates a timer and a 'PositionInterpolator' node for animating the pieces; then, routes the 'fraction_changed' output of the timer to the
// 'set_fraction' input of the interpolator. The 'value_changed' output of the last one will be routed and unrouted to the 'set_translation' input of
// the selected piece dinamically.
{
    var buildString = "";

    buildString =
        "<TimeSensor DEF = '" + TIME_NAME + "' cycleInterval = '" + CYCLE_INTERVAL + "'/>";

    Browser.currentScene.updateNamedNode( TIME_NAME, SFNode(buildString) );
    Browser.currentScene.getNamedNode("dynamic").addChild( Browser.currentScene.getNamedNode(TIME_NAME) );

    buildString =
        "<PositionInterpolator DEF = '" + ANIM_NAME + "' key = '0 0.25 0.5 0.75 1'/>";

    Browser.currentScene.updateNamedNode( ANIM_NAME, SFNode(buildString) );
    Browser.currentScene.getNamedNode("dynamic").addChild( Browser.currentScene.getNamedNode(ANIM_NAME) );

    Browser.addRoute( Browser.currentScene.getNamedNode(TIME_NAME), 'fraction_changed', Browser.currentScene.getNamedNode(ANIM_NAME), 'set_fraction' );
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END INITIALIZERS                                                                                                                                //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTANTS AND SETUP                                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;

const SELECTOR_HEIGHT = 0.7;

const BOARD_X = 3;
const BOARD_Z = 3;

const GROW_FRAC = 1 / ( BOARD_X + BOARD_Z );
const SHRINK_FRAC = -1 / ( BOARD_X + BOARD_Z );
const ADD_FRAC = 1 + (BOARD_X * BOARD_Z) / 100;
const MAX_NUM_PIECES = 3;

const BOARD_NAME = "Board";
const PIECE_NAME = "Piece";
const TIME_NAME = "Time";
const ANIM_NAME = "Animation";
const SELECT_NAME = "Selector";

const CYCLE_INTERVAL = 0.25;
const CURVE = MFFloat( 0, 0.10, 0.5, 0.90, 1 );

const FRONT_VIEWPOINT = "Front";
const RIGHT_VIEWPOINT = "Right";
const LEFT_VIEWPOINT = "Left";

function initialize()
{
    this.board = boardBuilder( BOARD_NAME, SFVec2f(BOARD_X, BOARD_Z) );
    this.selector = selectorBuilder( SELECT_NAME, SFVec3f(0, 0.2, 0) );
    addViewpoints();
    addAnimation();

    print( "Hey! I'm the game initializer" );
}

function setup( /*SFBool*/ trig )
{
    if( trig )
    {
        pieceBuilder( SFColor(1, 0, 0), this.board.collection[0].translation );
        pieceBuilder( SFColor(0, 1, 0), this.board.collection[BOARD_Z - 1].translation );
        pieceBuilder( SFColor(0, 0, 1), this.board.collection[BOARD_X * (BOARD_X - 1) + (BOARD_Z - 1)].translation );
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// COLOR API                                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const R_INDEX = 4;
const G_INDEX = 2;
const B_INDEX = 1;
const COLOR_TABLE =
[
    "k", // Color code: 0 0 0
    "b", // Color code: 0 0 1
    "g", // Color code: 0 1 0
    "c", // Color code: 0 1 1
    "r", // Color code: 1 0 0
    "m", // Color code: 1 0 1
    "y", // Color code: 1 1 0
    "w", // Color code: 1 1 1
];

function equal( colorA, colorB )
    {
        return (colorA.r == colorB.r) && (colorA.g == colorB.g) && (colorA.b == colorB.b);
    }

function add( colorA, colorB )
{
    var __color = new SFColor();

    if( white(colorA) )
        return colorB;
    else if( white(colorB) )
        return colorA;
    else
    {
        __color.r = colorA.r + colorB.r;
        __color.g = colorA.g + colorB.g;
        __color.b = colorA.b + colorB.b;

        if( __color.r > 1 ) __color.r = 1;
        if( __color.g > 1 ) __color.g = 1;
        if( __color.b > 1 ) __color.b = 1;
    }

    return __color;
}

function sum( color )
{
    return color.r + color.g + color.b;
}

function decode( /*SFColor*/ color )
{
    var __code = R_INDEX * color.r + G_INDEX * color.g + B_INDEX * color.b;

    return COLOR_TABLE[__code];
}

function white( color )
{
    return (color.r == 1) && (color.g == 1) && (color.b == 1);
}

function contained( colorA, colorB )
{
    var __color = add( colorA, colorB );

    return equal( __color, colorA ) || equal( __color, colorB );
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// END COLOR API                                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function pieces( /*MFNode*/ nodes )
{
    var __count = 0;

    for( t = 0; t < nodes.length; t++ )
    {
        if( nodes[t].getNodeName().search(PIECE_NAME) >= 0 ) __count++;
    }

    return __count;
}

function paint( row, col, color )
{
    var __num = row * BOARD_X + col;
    var __node = Browser.currentScene.getNamedNode(BOARD_NAME + "Transform" + __num).children[0];
    var __grow;

    if( white(__node.appearance.material.diffuseColor) )
    {
        __grow = SHRINK_FRAC;
        __node.appearance.material.diffuseColor = add(__node.appearance.material.diffuseColor, color);
        __node.appearance.texture.url = new MFString();
    }
    else
    {
        if( equal(__node.appearance.material.diffuseColor, color) )
        {
            __grow = GROW_FRAC;
            __node.appearance.material.diffuseColor = SFColor(1, 1, 1);
            __node.appearance.material.texture = new SFNode
            (
                "<ImageTexture url = 'textures/floor.png'/>"
            );
        }
        else if( contained(__node.appearance.material.diffuseColor, color) )
        {
            __grow = 0;
        }
        else
        {
            __grow = (1 + sum(__node.appearance.material.diffuseColor)) * SHRINK_FRAC;
            __node.appearance.material.diffuseColor = add(__node.appearance.material.diffuseColor, color);
        }
    }

    return __grow;
}

function select( /*SFBool*/ trig )
{
    if( trig )
    {
        var __node = Browser.currentScene.getNamedNode("mouse").hitObject_changed.getParents()[0];
        if( typeof select.show === 'undefined' ) select.show = true;

        if( typeof this.selected === 'undefined' ) this.selected = SFNode("Transform");

        if( __node.getNodeName() == this.selected.getNodeName() )
        {
            select.show = !select.show;
            this.selector.show = select.show;
        }
        else
        {
            this.selector.show = select.show;
            this.selector.changePos = SFVec3f(__node.translation[X_AXIS], __node.translation[Y_AXIS] + SELECTOR_HEIGHT, __node.translation[Z_AXIS]);
        }

        this.selected = __node;
    }
}

function move( /*SFBool*/ trig )
{
    if( trig )
    {
        var animation = true;

        if( animation )
        {
            if( typeof this.animation != 'undefined' )
            {
                Browser.currentScene.deleteRoute( this.animation );
            }

            this.animation = Browser.currentScene.addRoute( Browser.currentScene.getNamedNode(ANIM_NAME), 'value_changed', this.selected, 'translation' );

            var tmp = new SFVec3f
            (
                this.selected.translation[X_AXIS],
                this.selected.translation[Y_AXIS],
                this.selected.translation[Z_AXIS]
            );
            var out = new MFVec3f();
            var now = new Date();

            for( t = 0; t < Browser.currentScene.getNamedNode(ANIM_NAME).key.length; t++ )
            {
                out[t] = new SFVec3f
                (
                    tmp[X_AXIS] + (this.trans[X_AXIS] - tmp[X_AXIS]) * CURVE[t],
                    tmp[Y_AXIS],
                    tmp[Z_AXIS] + (this.trans[Z_AXIS] - tmp[Z_AXIS]) * CURVE[t]
                );
            }

            Browser.currentScene.getNamedNode(ANIM_NAME).getField('keyValue').setValue(out);
            
            Browser.currentScene.getNamedNode(TIME_NAME).set_stopTime = SFTime( now.getTime() / 1000 );
            Browser.currentScene.getNamedNode(TIME_NAME).set_startTime = SFTime( Browser.currentScene.getNamedNode(TIME_NAME).stopTime );
        }
        else
        {
            this.selected.translation = this.trans;
        }
    }
}

function walk( /*SFString*/ key )
{
    function is( /*SFString*/ name, /*MFNode*/ nodes )
    {        
        for( t = 0; t < nodes.length; t++ )
        {
            if( nodes[t].getNodeName() == name ) return true;
        }

        return false;
    }

    function outrange( /*SFVec3f*/ position )
    {
        var upper = ( position[X_AXIS] < BOARD_X ) && ( position[Z_AXIS] < BOARD_Z );
        var lower = ( position[X_AXIS] >= 0 ) && ( position[Z_AXIS] >= 0 );
        
        return upper && lower;
    }

    function occupated( /*SFVec3f*/ position )
    {
        var /*MFNode*/ __nodes = Browser.currentScene.getNamedNode("dynamic").children;

        for( t = 0; t < __nodes.length; t++ )
        {
            if( __nodes[t].getNodeName().search(PIECE_NAME) >= 0 )
            {
                if( (__nodes[t].translation[X_AXIS] == position[X_AXIS]) && (__nodes[t].translation[Z_AXIS] == position[Z_AXIS]) )
                {
                    return true;
                }
            }
        }

        return false;
    }

    function who( /*SFVec3f*/ position )
    {
        var /*MFNode*/ __nodes = Browser.currentScene.getNamedNode("dynamic").children;

        for( t = 0; t < __nodes.length; t++ )
        {
            if( __nodes[t].getNodeName().search(PIECE_NAME) >= 0 )
            {
                if( (__nodes[t].translation[X_AXIS] == position[X_AXIS]) && (__nodes[t].translation[Z_AXIS] == position[Z_AXIS]) )
                {
                    return __nodes[t];
                }
            }
        }

        return null;
    }

    var __axis, __dir;
    var __row, __col;
    var __grow;
    var __name = this.selected.getNodeName();
    var __process = true;

    switch( key )
    {
        case 'w':
            __axis = Z_AXIS;
            __dir = -1.0;
            break;
        case 'a':
            __axis = X_AXIS;
            __dir = -1.0;
            break;
        case 's':
            __axis = Z_AXIS;
            __dir = +1.0;
            break;
        case 'd':
            __axis = X_AXIS;
            __dir = +1.0;
            break;
        default:
            __process = false;
    }

    if( __process )
    {
        if( __name.search(BOARD_NAME) < 0 )
        {
            if( __name.search("Transform") < 0 )
            {
                __name += "Transform";
                this.selected = Browser.currentScene.getNamedNode(__name);
            }

            if( is(__name, Browser.currentScene.getNamedNode("dynamic").children) )
            {
                this.trans = new SFVec3f
                (
                    this.selected.translation[X_AXIS],
                    this.selected.translation[Y_AXIS],
                    this.selected.translation[Z_AXIS]
                );
                __row = this.selected.translation[X_AXIS];
                __col = this.selected.translation[Z_AXIS];

                this.trans[__axis] += __dir;
                if( outrange(this.trans) )
                {
                    __grow = paint( __row, __col, this.selected.children[0].appearance.material.diffuseColor );

                    if( occupated(this.trans) )
                    {
                        var __node = who( this.trans );

                        if( !white(add( __node.children[0].appearance.material.diffuseColor, this.selected.children[0].appearance.material.diffuseColor )) )
                        {
                            var __color = add( __node.children[0].appearance.material.diffuseColor, this.selected.children[0].appearance.material.diffuseColor );
                            __grow = ADD_FRAC * Browser.currentScene.getNamedNode(this.selected.getNodeName().replace("Transform", "")).scale;
                            var __str = decode( __color ) + PIECE_NAME;
                            
                            Browser.currentScene.getNamedNode( __node.getNodeName().replace("Transform", "") ).remove = true;
                            Browser.currentScene.getNamedNode( this.selected.getNodeName().replace("Transform", "") ).remove = true;

                            pieceBuilder( __color, this.trans );
                            this.selected = Browser.currentScene.getNamedNode(__str);
                            this.selected.restore = __grow;

                            this.selector.changePos = SFVec3f
                            (
                                this.trans[X_AXIS],
                                this.trans[Y_AXIS] + SELECTOR_HEIGHT,
                                this.trans[Z_AXIS]
                            );
                        }
                    }
                    else
                    {
                        Browser.currentScene.getNamedNode(__name.replace("Transform", "")).resize = __grow;

                        this.selector.changePos = new SFVec3f
                        (
                            this.trans[X_AXIS],
                            this.trans[Y_AXIS] + SELECTOR_HEIGHT,
                            this.trans[Z_AXIS]
                        );
                    }               
                }
            }
        }
        else
        {
            if( !white(this.selected.children[0].appearance.material.diffuseColor) )
            {
                this.trans = new SFVec3f
                (
                    this.selected.translation[X_AXIS],
                    this.selected.translation[Y_AXIS],
                    this.selected.translation[Z_AXIS]
                );

                this.trans[__axis] += __dir;

                if( pieces(Browser.currentScene.getNamedNode("dynamic").children) < MAX_NUM_PIECES )
                {
                    var __color = SFColor
                    (
                        this.selected.children[0].appearance.material.diffuseColor.r,
                        this.selected.children[0].appearance.material.diffuseColor.g,
                        this.selected.children[0].appearance.material.diffuseColor.b
                    );
                    var __str = decode( __color ) + PIECE_NAME;

                    this.selected.children[0].appearance.material.diffuseColor = SFColor(1, 1, 1);

                    pieceBuilder( __color, this.trans );
                    this.selected = Browser.currentScene.getNamedNode(__str);
                    this.selected.restore = GROW_FRAC;

                    this.selector.changePos = SFVec3f
                    (
                        this.trans[X_AXIS],
                        this.trans[Y_AXIS] + SELECTOR_HEIGHT,
                        this.trans[Z_AXIS]
                    );
                }
            }
        }
    }
}