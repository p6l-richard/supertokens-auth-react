"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
        var _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: [],
            },
            f,
            y,
            t,
            g;
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === "function" &&
                (g[Symbol.iterator] = function () {
                    return this;
                }),
            g
        );
        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y["return"]
                                    : op[0]
                                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                                    : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (
                                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
/*
 * Imports.
 */
/** @jsx jsx */
var react_1 = require("@emotion/react");
var react_2 = require("react");
var utils_1 = require("../../../../../utils");
var featureWrapper_1 = __importDefault(require("../../../../../components/featureWrapper"));
var styleContext_1 = require("../../../../../styles/styleContext");
var styles_1 = require("../../../../../styles/styles");
var styles_2 = require("../../themes/styles");
var signInAndUpCallback_1 = require("../../themes/signInAndUpCallback");
var componentOverrideContext_1 = require("../../../../../components/componentOverride/componentOverrideContext");
var translations_1 = require("../../themes/translations");
var SignInAndUpCallback = function (props) {
    var verifyCode = react_2.useCallback(
        function () {
            var pathName = utils_1.getCurrentNormalisedUrlPath().getAsStringDangerous();
            var providerId = pathName.split("/")[pathName.split("/").length - 1];
            return props.recipe.recipeImpl.signInAndUp({
                thirdPartyId: providerId,
                config: props.recipe.config,
            });
        },
        [props.recipe, props.history]
    );
    var handleVerifyResponse = react_2.useCallback(
        function (response) {
            return __awaiter(void 0, void 0, void 0, function () {
                var state, redirectToPath, isEmailVerified, ignored_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (response.status === "GENERAL_ERROR") {
                                return [
                                    2 /*return*/,
                                    props.recipe.redirectToAuthWithoutRedirectToPath(undefined, props.history, {
                                        error: "signin",
                                    }),
                                ];
                            }
                            if (response.status === "NO_EMAIL_GIVEN_BY_PROVIDER") {
                                return [
                                    2 /*return*/,
                                    props.recipe.redirectToAuthWithoutRedirectToPath(undefined, props.history, {
                                        error: "no_email_present",
                                    }),
                                ];
                            }
                            if (response.status === "FIELD_ERROR") {
                                return [
                                    2 /*return*/,
                                    props.recipe.redirectToAuthWithoutRedirectToPath(undefined, props.history, {
                                        error: "custom",
                                        message: response.error,
                                    }),
                                ];
                            }
                            if (!(response.status === "OK")) return [3 /*break*/, 7];
                            state = props.recipe.recipeImpl.getOAuthState();
                            redirectToPath = state === undefined ? undefined : state.redirectToPath;
                            if (!(props.recipe.emailVerification.config.mode === "REQUIRED")) return [3 /*break*/, 6];
                            isEmailVerified = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, props.recipe.emailVerification.isEmailVerified()];
                        case 2:
                            isEmailVerified = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            ignored_1 = _a.sent();
                            return [3 /*break*/, 4];
                        case 4:
                            if (!!isEmailVerified) return [3 /*break*/, 6];
                            return [
                                4 /*yield*/,
                                props.recipe.savePostEmailVerificationSuccessRedirectState({
                                    redirectToPath: redirectToPath,
                                    isNewUser: true,
                                    action: "SUCCESS",
                                }),
                            ];
                        case 5:
                            _a.sent();
                            return [
                                2 /*return*/,
                                props.recipe.emailVerification.redirect(
                                    {
                                        action: "VERIFY_EMAIL",
                                    },
                                    props.history
                                ),
                            ];
                        case 6:
                            return [
                                2 /*return*/,
                                props.recipe.redirect(
                                    {
                                        action: "SUCCESS",
                                        isNewUser: response.createdNewUser,
                                        redirectToPath: redirectToPath,
                                    },
                                    props.history
                                ),
                            ];
                        case 7:
                            return [2 /*return*/];
                    }
                });
            });
        },
        [props.recipe, props.history]
    );
    var handleError = react_2.useCallback(
        function () {
            return props.recipe.redirectToAuthWithoutRedirectToPath(undefined, props.history, {
                error: "signin",
            });
        },
        [props.recipe, props.history]
    );
    utils_1.useOnMountAPICall(verifyCode, handleVerifyResponse, handleError);
    var componentOverrides = props.recipe.config.override.components;
    var oAuthCallbackScreen = props.recipe.config.oAuthCallbackScreen;
    return react_1.jsx(
        componentOverrideContext_1.ComponentOverrideContext.Provider,
        { value: componentOverrides },
        react_1.jsx(
            featureWrapper_1.default,
            {
                useShadowDom: props.recipe.config.useShadowDom,
                defaultStore: translations_1.defaultTranslationsThirdParty,
            },
            react_1.jsx(
                styleContext_1.StyleProvider,
                {
                    rawPalette: props.recipe.config.palette,
                    defaultPalette: styles_1.defaultPalette,
                    styleFromInit: oAuthCallbackScreen.style,
                    rootStyleFromInit: props.recipe.config.rootStyle,
                    getDefaultStyles: styles_2.getStyles,
                },
                react_1.jsx(
                    react_2.Fragment,
                    null,
                    props.children === undefined && react_1.jsx(signInAndUpCallback_1.SignInAndUpCallbackTheme, null),
                    props.children
                )
            )
        )
    );
};
exports.default = SignInAndUpCallback;
