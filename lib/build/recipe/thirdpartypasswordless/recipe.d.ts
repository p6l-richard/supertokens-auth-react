/// <reference types="react" />
import AuthRecipeWithEmailVerification from "../authRecipeWithEmailVerification";
import { CreateRecipeFunction } from "../../types";
import {
    Config,
    GetRedirectionURLContext,
    NormalisedConfig,
    PreAPIHookContext,
    OnHandleEventContext,
    UserInput,
    TPPWlessRecipeInterface,
} from "./types";
import Passwordless from "../passwordless/recipe";
import ThirdParty from "../thirdparty/recipe";
import EmailVerification from "../emailverification/recipe";
export default class ThirdPartyPasswordless extends AuthRecipeWithEmailVerification<
    GetRedirectionURLContext,
    PreAPIHookContext,
    OnHandleEventContext,
    NormalisedConfig
> {
    static instance?: ThirdPartyPasswordless;
    static RECIPE_ID: string;
    passwordlessRecipe: Passwordless | undefined;
    thirdPartyRecipe: ThirdParty | undefined;
    recipeImpl: TPPWlessRecipeInterface;
    constructor(
        config: Config,
        recipes: {
            emailVerificationInstance: EmailVerification | undefined;
            thirdPartyInstance: ThirdParty | undefined;
            passwordlessInstance: Passwordless | undefined;
        }
    );
    getFeatures: () => Record<string, import("../../types").ComponentWithRecipeAndMatchingMethod>;
    getDefaultRedirectionURL: (
        context: import("../authRecipeWithEmailVerification/types").GetRedirectionURLContext
    ) => Promise<string>;
    getFeatureComponent: (
        componentName: "emailverification" | "signInUp" | "linkClickedScreen" | "signinupcallback",
        props: any
    ) => JSX.Element;
    static init(
        config: UserInput
    ): CreateRecipeFunction<GetRedirectionURLContext, PreAPIHookContext, OnHandleEventContext, NormalisedConfig>;
    static getInstanceOrThrow(): ThirdPartyPasswordless;
    static reset(): void;
}
