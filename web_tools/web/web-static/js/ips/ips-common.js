function slpClassificationToObject(slp_data, gen_obj) {
    for (var i = 0; i < slp_data.length; i++) { /* data = [{"filter_151273714": {"values":..., "cn_values":...}}] */
        var criterion;
        for (var k in slp_data[i]) {
            criterion = k;
            break;
        }
        gen_obj[criterion] = slp_data[i][criterion];
    }
}

/**
 * Translate given criteria to Chinese so that we can present to user.
 * If no translation can be found, return original strings.
 *
 * @param criteria ["high", "med"]
 * @param classification_obj {"severity":{values:['high',...], cn_values:['高',...]},"target":{...},...}
 * @param numlimit number of maximum output elements
 * @param fieldname "severity" or something present in classification_obj
 */
function translateCriteria(criteria, classification_obj, numlimit, fieldname) {
    var res = [];
    var transSrc = classification_obj[fieldname] || {};
    var transFound = false;
    if (typeof(criteria) == "string") {
        criteria = [criteria];
    }
    for (var i = 0; i < criteria.length && (numlimit <= 0 || i < numlimit); i++) {
        // Normally there would be just 10- members in classification_obj[fieldname]
        transFound = false;
        if (transSrc.values) {
            for (var j = 0; j < transSrc.values.length; j++) {
                if (transSrc.values[j] == criteria[i]) {
                    res.push(transSrc.cn_values[j])
                    transFound = true;
                }
            }
        }
        if (!transFound) {
            res.push(criteria[i]);
        }
    }
    return res;
}

/**
 * Similar to `translateCriteria`, but works with "app".
 * If no translation can be found, return nothing - mind this when populating the database!
 *
 * @param vals ["nginx","mail"]
 * @param app_cat_obj [{"app_cat_1":{"name":"C1","cn_name":"类1","app_name":["a1",...],"app_cn_name":["应用1",...]}},...]
 * @param numlimit
 */
function translateAppName(vals, app_cat_obj, numlimit) {
    var res = [];

    function matchAndAdd(cat, cat_cn) {
        for (var vi = 0; vi < vals.length; vi++) {
            if (vals[vi] == cat && (numlimit <= 0 || res.length < numlimit)) {
                res.push(cat_cn);
            }
        }
    }

    if (typeof(vals) == "string") {
        vals = [vals];
    }

    if (app_cat_obj == undefined) {
        app_cat_obj = [];
    }

    for (var i = 0; i < app_cat_obj.length; i++) {
        var cat;
        for (var k in app_cat_obj[i]) {
            cat = app_cat_obj[i][k];
            break;
        }

        matchAndAdd(cat.name, cat.cn_name);
        if (cat.app) {
            for (var j = 0; j < cat.app.length; j++) {
                matchAndAdd(cat.app[j], cat.app_cn_name[j]);
            }
        }
    }

    return res;
}

/*
 * Zero out host number: 192.168.0.129/25 -> 192.168.0.128/25.
 *
 * Make sure input parameter is valid CIDR format!
 */
function normalizeCIDR(s) {
    var parts = s.split("/");
    if (parts.length != 2) {
        return s;
    }

    if (parts[1] == "32") {
        /* Most of the time (JavaScript spec and hardware lshift instruction)
         * only 5 bits are used in right operand.
         */
        return s;
    }

    var mask = parseInt(parts[1]);
    var ip_int = $.su.func.ipToInt(parts[0]);
    var mask_int = ((1 << mask) - 1) << (32 - mask);
    var norm_ip_int = ip_int & mask_int;
    return $.su.func.intToIp(norm_ip_int) + "/" + mask;
}
