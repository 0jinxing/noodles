#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { NoodlesStack } from './stack';

const app = new cdk.App();
new NoodlesStack(app, 'NoodlesStack');
