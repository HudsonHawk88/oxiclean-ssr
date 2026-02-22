import {createPool, type QueryError} from "mysql2";
import jwt, {type JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import {createWriteStream, existsSync, mkdirSync} from "fs";
import fetch from "isomorphic-fetch";
import moment from "moment";
import {URL} from "url";
import {fileURLToPath} from "node:url";
import dotenvExpand from 'dotenv-expand';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath: string = path.resolve((dirname), "../../.env");

dotenvExpand.expand(dotenv.config({
    path: envPath,
}));

const mailUrl = `smtps://${process.env.mailserverUser}:${process.env.mailserverPassword}@${process.env.mailserverHost}`;

const db_params = {
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpass,
    database: process.env.database,
};

const pool = createPool(db_params);

const log = (endPoint: string, error: QueryError | Error | null) => {
    const date = moment(new Date()).format("YYYY-MM-DD");
    const time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const filePath: string = `${process.env.logDir}/${date}_error.log`;
    const isDirExist = existsSync(dirname + process.env.logDir);
    const logger = createWriteStream(filePath, { flags: "a" });

    if (!isDirExist) {
        mkdirSync(dirname + process.env.logDir);
    }

    logger.write(`ERROR: ${endPoint}: ${time} - ${error}\n`);
};

const quote = (val: never) => (val);

const boolValues = [
    "isHirdetheto",
    "isKiemelt",
    "isErkely",
    "isLift",
    "isAktiv",
    "isUjEpitesu",
    "isErtekesito",
    "isActive",
    "isTetoter",
    "isVip",
    "isTobbEpuletes",
    "isAkadalymentes",
    "isLegkondicionalt",
    "isZoldOtthon",
    "isNapelemes",
    "isSzigetelt",
    "isPublikus",
];

const stringToBool = (value: string) => {
    let result = false;
    if (value === "true" || value === "1") {
        result = true;
    }

    return result;
};

const getId = async (reqID: string, tableName: string) => {
    let id = undefined;
    if (reqID !== undefined) {
        id = parseInt(reqID, 10);
    } else {
        const isExist = await isTableExists(tableName);
        if (isExist) {
            const getLastIdSql = `SELECT MAX(id) as id FROM ${tableName};`;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const result: Array<never> = await UseQuery(getLastIdSql);
            const {id: newID} = result[0];
            if (newID) {
                id = newID + 1;
            } else {
                id = 1;
            }
        } else {
            id = 1;
        }
    }

    return id;
};

function verifyJson(input: string) {
    try {
        JSON.parse(input);
    } catch {
        return false;
    }
    return true;
}

const isObjectKey = (objectKeys: Array<string>, key: string) => {
    let result = false;

    if (objectKeys.find((element: string) => element === key)) {
        result = true;
    }

    return result;
};

const getInsertSql = (
    tableName: string,
    keys: Array<string>,
    object: never,
    objectKeys: never
) => {
    let c = `INSERT INTO ${tableName} (`;
    let v = "";
    keys.forEach((key: string, index: number) => {
        if (isObjectKey(objectKeys, key)) {
            /* if ((key === 'borito' || key === 'projektlakaskepek', key === 'cim', key === 'epuletszintek')) { */
            if (index < keys.length - 1) {
                c = c.concat(`${key},`);
                v = v.concat(`'${JSON.stringify(object[key])}', `);
            } else {
                c = c.concat(`${key}`);
                v = v.concat(`'${JSON.stringify(object[key])}'`);
            }
        } else {
            if (index < keys.length - 1) {
                c = c.concat(`${key},`);
                v = v.concat(`'${object[key]}', `);
            } else {
                c = c.concat(`${key}`);
                v = v.concat(`'${object[key]}'`);
            }
        }
        return v;
    });

    return c.concat(`) VALUES (${v});`);
};

const getUpdateScript = (table: string, criteria: string, update: never) => {
    let sql = `UPDATE ${table} SET ${Object.entries(update)
        .map(
            ([field, value]) =>
                `${field}=${verifyJson(value as string) ? JSON.stringify(value) : quote(value as never)}`
        )
        .join(", ")} WHERE ${Object.entries(criteria)
        .map(([field, value]) => `${field}=${quote(value as never)}`)
        .join(" AND ")}`;

    const first: string = sql.substring(0, sql.indexOf("id"));
    const second: string = sql.substring(sql.indexOf(", ") + 2, sql.length);
    sql = first.concat(second);

    return sql;
};


const getJSONfromLongtext = (object: never, direction = "toBool") => {
    if (object) {
        const keys = Object.keys(object);
        const newObj = {};
        keys.forEach((key) => {
            if (isObjectKey(boolValues, key)) {
                if (direction) {
                    if (direction === "toBool") {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        newObj[key] = !(object[key] === 0 || object[key] === "0");
                    } else if (direction === "toNumber") {
                        if (object[key] === false || object[key] === "false") {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            newObj[key] = 0;
                        } else {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            newObj[key] = 1;
                        }
                    }
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return newObj[key];
            } else {
                if (verifyJson(object[key])) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    newObj[key] = JSON.parse(object[key]);
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    newObj[key] = object[key];
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return newObj[key];
            }
        });
        return newObj;
    }
};

const jwtparams = {
    secret: process.env.JWT_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    expire: process.env.JWT_EXPIRE,
};

const isObject = (object: object) => {
    return object !== null && typeof object === "object";
};

const UseQuery = async (sql: string, logEndPoint?: string) => {
    return new Promise((data) => {
        pool.query(sql, function (error, result) {
            // change db->connection for your code
            if (error) {
                if (logEndPoint) {
                    log(logEndPoint, error);
                } else {
                    log(sql, error);
                }

                throw error;
            } else {
                try {
                    data(result);
                } catch (error) {
                    data([]);
                    if (logEndPoint) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        log(logEndPoint, error);
                    } else {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        log(sql, error);
                    }
                    throw error;
                }
            }
        });
    });
};

const getBooleanFromNumber = (value: string | number) => {
    if (value === 1 || value === "1") {
        return true;
    } else {
        return false;
    }
};

const getNumberFromBoolean = (value: string | boolean) => {
    if (value === "true" || value === true) {
        return 1;
    } else {
        return 0;
    }
};

const validateToken = async (token: string, secret: string) => {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const result: JwtPayload = jwt.verify(token, secret);
        return {
            id: result.id,
            username: result.username,
            nev: result.nev,
            mobil: result.mobil,
            roles: result.roles,
            avatar: result.avatar || [],
            isAdmin: Boolean(result.isAdmin),
            allapot: result.allapot,
            soforid: result.id,
        };
    } catch {
        return null;
    }
};

const hasRole = (userRoles: Array<{ value: string }>, minRoles: Array<string>) => {
    let result = false;
    userRoles.forEach((userrole: { value: string }) => {
        if (minRoles.includes(userrole.value)) {
            result = true;
        }
    });

    return result;
};

const isTableExists = async (tableName: string) => {
    const isExistSql = `SHOW TABLES LIKE "${tableName}";`;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const isExist: Array<string> = await UseQuery(isExistSql);

    return isExist.length !== 0;
};

const getIngatlanokByKm = async (telepules: string, km: string | number) => {
    const getCoordinatesSql = `SELECT geoLong, geoLat FROM telep_1 WHERE telepulesnev='${telepules}'`;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const coordinates: Array<{ geoLat: number | string , geoLong: number | string }> = await UseQuery(getCoordinatesSql);
    return `LEFT JOIN (SELECT (6371 * acos(cos(radians(${
        coordinates[0].geoLat
    })) * cos(radians(geoLat)) * cos(radians(geoLong) - radians(${
        coordinates[0].geoLong
    })) + sin(radians(${
        coordinates[0].geoLat
    })) * sin(radians(geoLat)))) AS distance, telepulesnev FROM telep_1 GROUP BY telepulesnev HAVING distance <= ${
        km ? km : 0
    }) AS distances ON distances.telepulesnev = telepules`;
};

const sendSMS = async (mobileNumber: string | number, message: string) => {
    let url = new URL(
        `https://api.bipkampany.hu/sendsms?type=unicode&format=json&key=${process.env.SMSKEY}&number=${mobileNumber}&message=${message}`
    );
    if (process.env.senderid && process.env.senderid !== "") {
        url = new URL(
            `https://api.bipkampany.hu/sendsms?type=unicode&format=json&key=${process.env.SMSKEY}&senderid=${process.env.senderid}&number=${mobileNumber}&message=${message}`
        );
    }
    try {
        const res = await fetch(url, {
            method: "GET",
        });
        return res.json();
    } catch (err: unknown) {
        log(`https://api.bipkampany.hu/sendsms?type=unicode&format=json&key=${process.env.SMSKEY}&senderid=${process.env.senderid}&number=${mobileNumber}&message=${message}`, err as QueryError);
    }
};

export {
    pool,
    mailUrl,
    log,
    stringToBool,
    getId,
    isObject,
    jwtparams,
    UseQuery,
    validateToken,
    hasRole,
    getIngatlanokByKm,
    getJSONfromLongtext,
    getInsertSql,
    getUpdateScript,
    getBooleanFromNumber,
    getNumberFromBoolean,
    isTableExists,
    sendSMS,
    verifyJson,
};