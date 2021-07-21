import {
  UserRelationsResolver,
  UserCrudResolver,
  ResolversEnhanceMap,
  ResolverActionsConfig,
  applyResolversEnhanceMap,
  Role,
} from '../../generated/graphql'
import { Authorized, Extensions } from 'type-graphql'

// define the decorators config using generic ResolverActionsConfig<TModelName> type
const userActionsConfig: ResolverActionsConfig<'User'> = {
  users: [Authorized(Role.ADMIN)],
  updateUser: [Authorized(Role.ADMIN)],
  deleteUser: [
    Authorized(Role.ADMIN),
    Extensions({ logMessage: 'Danger zone' }),
  ],
}

// join the actions config into a single resolvers enhance object
const resolversEnhanceMap: ResolversEnhanceMap = {
  User: userActionsConfig,
}

// apply the config (it will apply decorators on the resolver class methods)
applyResolversEnhanceMap(resolversEnhanceMap)

export default {
  UserRelationsResolver,
  UserCrudResolver,
}
