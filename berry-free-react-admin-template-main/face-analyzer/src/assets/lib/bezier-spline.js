/* bezier-spline.js
 *
 * computes cubic bezier coefficients to generate a smooth
 * line through specified points. couples with SVG graphics 
 * for interactive processing.
 *
 * For more info see:
 * http://www.particleincell.com/2012/bezier-splines/ 
 *
 * Lubos Brieda, Particle In Cell Consulting LLC, 2012
 * you may freely use this algorithm in your codes however where feasible
 * please include a link/reference to the source article
 */ 

//var S=new Array() /*splines*/
var S;
var V=new Array() /*vertices*/
var C 	/*current object*/
var x0,y0	/*svg offset*/

/*saves elements as global variables*/
function init()
{
	/*create splines*/
	//S[0] = createPath("blue");
	//S[1] = createPath("red");
	//S[2] = createPath("green");
	//S[3] = createPath("brown");

	/*create control points*/
	//V[0] = createKnot(60,60);
	//V[1] = createKnot(220,300);
	//V[2] = createKnot(420,300);
	//V[3] = createKnot(700,240);
	
	updateSplines();
}
/*creates and adds an SVG circle to represent knots*/
function createKnot(x,y)
{
	V.push([x,y]);
}

/*creates and adds an SVG path without defining the nodes*/
function createPath(color,width)
{		
	width = (typeof width == 'undefined' ? "8" : width);
	var P=document.createElementNS("http://www.w3.org/2000/svg","path")
	P.setAttributeNS(null,"fill","none")
	P.setAttributeNS(null,"stroke",color)
	P.setAttributeNS(null,"stroke-width",width)
	svg.appendChild(P)
	return P
}
	
/*computes spline control points*/
function updateSplines()
{	
	/*grab (x,y) coordinates of the control points*/
	x=new Array();
	y=new Array();
	for (i=0;i<V.length;i++)
	{
		/*use parseInt to convert string to int*/
		x[i]=parseInt(V[i][0])
		y[i]=parseInt(V[i][1])
	}
	
	/*computes control points p1 and p2 for x and y direction*/
	px = computeControlPoints(x);
	py = computeControlPoints(y);
    
    //console.log(px);
	
	/*updates path settings, the browser will draw the new spline*/
	S = [];
	for (i=0;i<V.length-1;i++)
		S.push([x[i],y[i],px.p1[i],py.p1[i],px.p2[i],py.p2[i],x[i+1],y[i+1]]);
	//S = [x[i],y[i],px.p1[i],py.p1[i],px.p2[i],py.p2[i],x[i+1],y[i+1]];
	/*for (i=0;i<3;i++)
    {
        S[i] = [];
		S[i].push([x[i],y[i],px.p1[i],py.p1[i],px.p2[i],py.p2[i],x[i+1],y[i+1]]);
    }*/
}

/*computes control points given knots K, this is the brain of the operation*/
function computeControlPoints(K)
{
	p1=new Array();
	p2=new Array();
	n = K.length-1;
	
	/*rhs vector*/
	a=new Array();
	b=new Array();
	c=new Array();
	r=new Array();
	
	/*left most segment*/
	a[0]=0;
	b[0]=2;
	c[0]=1;
	r[0] = K[0]+2*K[1];
	
	/*internal segments*/
	for (i = 1; i < n - 1; i++)
	{
		a[i]=1;
		b[i]=4;
		c[i]=1;
		r[i] = 4 * K[i] + 2 * K[i+1];
	}
			
	/*right segment*/
	a[n-1]=2;
	b[n-1]=7;
	c[n-1]=0;
	r[n-1] = 8*K[n-1]+K[n];
	
	/*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
	for (i = 1; i < n; i++)
	{
		m = a[i]/b[i-1];
		b[i] = b[i] - m * c[i - 1];
		r[i] = r[i] - m*r[i-1];
	}
 
	p1[n-1] = r[n-1]/b[n-1];
	for (i = n - 2; i >= 0; --i)
		p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];
		
	/*we have p1, now compute p2*/
	for (i=0;i<n-1;i++)
		p2[i]=2*K[i+1]-p1[i+1];
	
	p2[n-1]=0.5*(K[n]+p1[n-1]);
	
	return {p1:p1, p2:p2};
}

/*code from http://stackoverflow.com/questions/442404/dynamically-retrieve-html-element-x-y-position-with-javascript*/
function getOffset( el ) 
{
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}