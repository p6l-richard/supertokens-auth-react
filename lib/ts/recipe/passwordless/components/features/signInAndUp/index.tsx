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
import { jsx } from "@emotion/react";
import * as React from "react";
import { PureComponent, Fragment } from "react";
import SignInUpTheme from "../../themes/signInUp";
import FeatureWrapper from "../../../../../components/featureWrapper";
import { StyleProvider } from "../../../../../styles/styleContext";
import { defaultPalette } from "../../../../../styles/styles";
import { getQueryParams, getRedirectToPathFromURL } from "../../../../../utils";
import Recipe from "../../../recipe";
import { getStyles } from "../../../components/themes/styles";
import { RecipeInterface, LoginAttemptInfo } from "../../../types";
import { ComponentOverrideContext } from "../../../../../components/componentOverride/componentOverrideContext";
import { FeatureBaseProps } from "../../../../../types";

type SignInUpState = {
    error: string | undefined;
    loaded: boolean;
    loginAttemptInfo: LoginAttemptInfo | undefined;
};

type PropType = FeatureBaseProps & {
    recipe: Recipe;
};

class SignInUp extends PureComponent<PropType, SignInUpState> {
    constructor(props: PropType) {
        super(props);

        let error: string | undefined = undefined;
        const errorQueryParam = getQueryParams("error");
        if (errorQueryParam !== null) {
            if (errorQueryParam === "signin") {
                error = "Something went wrong. Please try again";
            } else if (errorQueryParam === "restart") {
                error = "The link you tried to click expired or was revoked. Please try again.";
            }
        }
        this.state = {
            loaded: false,
            loginAttemptInfo: undefined,
            error,
        };
    }

    getIsEmbedded = (): boolean => {
        if (this.props.isEmbedded !== undefined) {
            return this.props.isEmbedded;
        }
        return false;
    };

    getModifiedRecipeImplementation = (): RecipeInterface => {
        return {
            ...this.props.recipe.recipeImpl,
            createCode: async (input) => {
                let contactInfo;
                if ("email" in input) {
                    contactInfo = input.email;
                } else if ("phoneNumber" in input) {
                    contactInfo = input.phoneNumber;
                } else {
                    if (this.state.loginAttemptInfo === undefined) {
                        throw new Error("ResendWithoutSavedInfo");
                    }
                    const storedContactInfo = this.state.loginAttemptInfo.contactInfo;
                    contactInfo = storedContactInfo;
                }
                const res = await this.props.recipe.recipeImpl.createCode(input);
                if (res.status === "OK") {
                    const loginAttemptInfo = {
                        ...res,
                        lastResend: new Date().getTime(),
                        contactInfoType: this.props.recipe.config.contactInfoType,
                        contactInfo,
                    };
                    this.props.recipe.recipeImpl.setLoginAttemptInfo(loginAttemptInfo);
                    this.setState((os) => ({
                        ...os,
                        loginAttemptInfo,
                    }));
                } else if (res.status === "RESTART_FLOW_ERROR") {
                    await this.props.recipe.recipeImpl.clearLoginAttemptInfo();

                    this.setState((os) => ({
                        ...os,
                        error: "Please try again.",
                        loginAttemptInfo: undefined,
                    }));
                }
                return res;
            },
            consumeCode: async (input) => {
                const res = await this.props.recipe.recipeImpl.consumeCode(input);
                if (res.status === "RESTART_FLOW_ERROR") {
                    await this.props.recipe.recipeImpl.clearLoginAttemptInfo();

                    this.setState((os) => ({
                        ...os,
                        error: "Please try again.",
                        loginAttemptInfo: undefined,
                    }));
                }
                if (res.status === "OK") {
                    await this.props.recipe.recipeImpl.clearLoginAttemptInfo();
                }

                return res;
            },
            clearLoginAttemptInfo: async () => {
                await this.props.recipe.recipeImpl.clearLoginAttemptInfo();
                this.setState((os) => ({
                    ...os,
                    loginAttemptInfo: undefined,
                }));
            },
        };
    };

    componentDidMount = async (): Promise<void> => {
        if (this.state.error) {
            await this.props.recipe.recipeImpl.clearLoginAttemptInfo();
            this.setState((s) => ({ ...s, loaded: true }));
        } else {
            const loginAttemptInfo = await this.getModifiedRecipeImplementation().getLoginAttemptInfo();
            this.setState((s) => ({ ...s, loaded: true, loginAttemptInfo }));
        }
    };

    render = (): JSX.Element => {
        const componentOverrides = this.props.recipe.config.override.components;

        const isEmail = this.props.recipe.config.contactInfoType === "EMAIL";
        const conf = isEmail ? this.props.recipe.config.emailForm : this.props.recipe.config.mobileForm;

        const props = {
            onSuccess: () => {
                return this.props.recipe.redirect(
                    {
                        action: "SUCCESS",
                        isNewUser: false,
                        redirectToPath: getRedirectToPathFromURL(),
                    },
                    this.props.history
                );
            },
            loaded: this.state.loaded,
            loginAttemptInfo: this.state.loginAttemptInfo,
            error: this.state.error,
            recipeImplementation: this.getModifiedRecipeImplementation(),
            config: this.props.recipe.config,
        };

        return (
            <ComponentOverrideContext.Provider value={componentOverrides}>
                <FeatureWrapper useShadowDom={this.props.recipe.config.useShadowDom} isEmbedded={this.getIsEmbedded()}>
                    <StyleProvider
                        rawPalette={this.props.recipe.config.palette}
                        defaultPalette={defaultPalette}
                        styleFromInit={conf.style}
                        rootStyleFromInit={this.props.recipe.config.rootStyle}
                        getDefaultStyles={getStyles}>
                        <Fragment>
                            {/* No custom theme, use default. */}
                            {this.props.children === undefined && <SignInUpTheme {...props} />}

                            {/* Otherwise, custom theme is provided, propagate props. */}
                            {this.props.children && React.cloneElement(this.props.children, props)}
                        </Fragment>
                    </StyleProvider>
                </FeatureWrapper>
            </ComponentOverrideContext.Provider>
        );
    };
}

export default SignInUp;