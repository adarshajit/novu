import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { UserEntity } from './user.entity';

const userSchema = new Schema(
  {
    firstName: Schema.Types.String,
    lastName: Schema.Types.String,
    email: Schema.Types.String,
    profilePicture: Schema.Types.String,
    resetToken: Schema.Types.String,
    resetTokenDate: Schema.Types.Date,
    resetTokenCount: {
      reqInMinute: Schema.Types.Number,
      reqInDay: Schema.Types.Number,
    },
    showOnBoarding: Schema.Types.Boolean,
    tokens: [
      {
        providerId: Schema.Types.String,
        provider: Schema.Types.String,
        accessToken: Schema.Types.String,
        refreshToken: Schema.Types.String,
        valid: Schema.Types.Boolean,
        lastUsed: Schema.Types.Date,
        username: Schema.Types.String,
      },
    ],
    password: Schema.Types.String,
    failedLogin: {
      times: Schema.Types.Number,
      lastFailedAttempt: Schema.Types.Date,
    },
  },
  schemaOptions
);

export interface IUserDocument extends UserEntity, Document {
  _id: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);
