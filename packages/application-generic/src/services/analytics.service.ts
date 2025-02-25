import Analytics from 'analytics-node';

// Due to problematic analytics-node types, we need to use require
// eslint-disable-next-line @typescript-eslint/naming-convention
const AnalyticsClass = require('analytics-node');

interface IOrganization {
  name?: string | null;
  createdAt?: string | null;
}

interface IUser {
  _id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  profilePicture?: string | null;
  createdAt?: string | null;
}

export class AnalyticsService {
  private segment: Analytics;

  constructor(private segmentToken?: string | null) {}

  async initialize() {
    if (this.segmentToken) {
      this.segment = new AnalyticsClass(this.segmentToken);
    }
  }

  upsertGroup(
    organizationId: string,
    organization: IOrganization,
    user: IUser
  ) {
    if (this.segmentEnabled) {
      this.segment.group({
        userId: user._id,
        groupId: organizationId,
        traits: {
          _organization: organizationId,
          id: organizationId,
          name: organization.name,
          createdAt: organization.createdAt,
          domain: user.email?.split('@')[1],
        },
      });
    }
  }

  alias(distinctId: string, userId: string) {
    if (this.segmentEnabled) {
      this.segment.alias({
        previousId: distinctId,
        userId: userId,
      });
    }
  }

  upsertUser(user: IUser, distinctId: string) {
    if (this.segmentEnabled) {
      const githubToken = (user as any).tokens?.find(
        (token) => token.provider === 'github'
      );

      this.segment.identify({
        userId: distinctId,
        traits: {
          firstName: user.firstName,
          lastName: user.lastName,
          name: ((user.firstName || '') + ' ' + (user.lastName || '')).trim(),
          email: user.email,
          avatar: user.profilePicture,
          createdAt: user.createdAt,
          githubProfile: githubToken?.username,
        },
      });
    }
  }

  setValue(userId: string, propertyName: string, value: string | number) {
    if (this.segmentEnabled) {
      this.segment.identify({
        userId: userId,
        traits: {
          [propertyName]: value,
        },
      });
    }
  }

  track(name: string, userId: string, data: Record<string, unknown> = {}) {
    if (this.segmentEnabled) {
      this.segment.track({
        userId: userId,
        event: name,
        properties: data,
      });
    }
  }

  private get segmentEnabled() {
    return process.env.NODE_ENV !== 'test' && this.segment;
  }
}
