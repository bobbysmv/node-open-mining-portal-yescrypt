var express = require( "express" );
var var bitcoin = require('bitcoin');
var router = express.Router();
var APIStatusCode = require( "./APIStatusCode" );


// cross domain
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Uid");
    res.header('Content-Type', 'application/json');
    next();
});
router.options("/*", function(req, res, next){
    res.send(200);
});


var client;
// init client
router.use(function (req, res, next) {

    //
    if( !client ){

        var poolConfigs = JSON.parse(process.env.pools);
        var conf = poolConfigs["bitzeny"].paymentProcessing.daemon;
        client = new bitcoin.Client({
            host: conf.host,
            port: conf.port,
            user: conf.user,
            pass: conf.password
        });

    }

    // if( !req.headers.uid ) return next();
    // User.getById( req.db, req.headers.uid )
    //     .then((user)=>{
    //     req.user = user;
    //     next();
    // })
    // .catch(()=>next());

    next();
});


/**
 *
 */
router.get('/',function(req, res) {

    client.getInfo(function( err, response ){
        if( err ) {
            return res.status(400).send({ status: APIStatusCode.EXCEPTION });
        }
        //
        res.status(200).send({
            status: APIStatusCode.SUCCESS,
            body: response
        });
    });
});

/**
 * notfound
 */
router.use( function(req, res, next) {
    res.status(400).send({ status: APIStatusCode.EXCEPTION });
});
module.exports = router;