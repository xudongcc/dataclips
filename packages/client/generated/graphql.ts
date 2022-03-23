import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Source": [
      "DatabaseSource",
      "VirtualSource"
    ]
  }
};
      export default result;
    
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Chart = {
  __typename?: 'Chart';
  clipId: Scalars['ID'];
  config: Scalars['JSONObject'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  token?: Maybe<Scalars['String']>;
  type: ChartType;
  updatedAt: Scalars['DateTime'];
};

export type ChartConnection = {
  __typename?: 'ChartConnection';
  edges?: Maybe<Array<ChartEdge>>;
  nodes?: Maybe<Array<Chart>>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type ChartEdge = {
  __typename?: 'ChartEdge';
  cursor: Scalars['String'];
  node: Chart;
};

export enum ChartType {
  BAR = 'BAR',
  FUNNEL = 'FUNNEL',
  LINE = 'LINE',
  METRIC = 'METRIC',
  PIE = 'PIE'
}

export type Clip = {
  __typename?: 'Clip';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  lastViewedAt?: Maybe<Scalars['DateTime']>;
  latestResultAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  results: ResultConnection;
  sourceId: Scalars['ID'];
  sql: Scalars['String'];
  token?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};


export type ClipResultsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Ordering>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
};

export type ClipConnection = {
  __typename?: 'ClipConnection';
  edges?: Maybe<Array<ClipEdge>>;
  nodes?: Maybe<Array<Clip>>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type ClipEdge = {
  __typename?: 'ClipEdge';
  cursor: Scalars['String'];
  node: Clip;
};

export type CreateChartInput = {
  clipId: Scalars['ID'];
  config: Scalars['JSONObject'];
  name: Scalars['String'];
  type: ChartType;
};

export type CreateClipInput = {
  name: Scalars['String'];
  sourceId?: InputMaybe<Scalars['ID']>;
  sql: Scalars['String'];
};

export type CreateDatabaseSourceInput = {
  database?: InputMaybe<Scalars['String']>;
  host: Scalars['String'];
  name: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  port?: InputMaybe<Scalars['Int']>;
  type: DatabaseType;
  username: Scalars['String'];
};

export type CreateProjectInput = {
  name: Scalars['String'];
};

export type CreateVirtualSourceInput = {
  name: Scalars['String'];
  tables: Array<CreateVirtualSourceTableInput>;
};

export type CreateVirtualSourceTableInput = {
  clipId: Scalars['ID'];
  name: Scalars['String'];
};

export type DatabaseSource = {
  __typename?: 'DatabaseSource';
  createdAt: Scalars['DateTime'];
  database?: Maybe<Scalars['String']>;
  host: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  port?: Maybe<Scalars['Int']>;
  type: DatabaseType;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export enum DatabaseType {
  MYSQL = 'MYSQL',
  POSTGRESQL = 'POSTGRESQL'
}

export type Mutation = {
  __typename?: 'Mutation';
  createChart: Chart;
  createClip: Clip;
  createDatabaseSource: DatabaseSource;
  createProject: Project;
  createVirtualSource: VirtualSource;
  deleteChart: Scalars['ID'];
  deleteClip: Scalars['ID'];
  deleteProject: Scalars['ID'];
  deleteSource: Scalars['ID'];
  updateChart: Chart;
  updateClip: Clip;
  updateDatabaseSource: DatabaseSource;
  updateProject: Project;
  updateVirtualSource: VirtualSource;
};


export type MutationCreateChartArgs = {
  input: CreateChartInput;
};


export type MutationCreateClipArgs = {
  input: CreateClipInput;
};


export type MutationCreateDatabaseSourceArgs = {
  input: CreateDatabaseSourceInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreateVirtualSourceArgs = {
  input: CreateVirtualSourceInput;
};


export type MutationDeleteChartArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteClipArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSourceArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateChartArgs = {
  id: Scalars['ID'];
  input: UpdateChartInput;
};


export type MutationUpdateClipArgs = {
  id: Scalars['ID'];
  input: UpdateClipInput;
};


export type MutationUpdateDatabaseSourceArgs = {
  id: Scalars['ID'];
  input: UpdateDatabaseSourceInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID'];
  input: UpdateProjectInput;
};


export type MutationUpdateVirtualSourceArgs = {
  id: Scalars['ID'];
  input: UpdateVirtualSourceInput;
};

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type Ordering = {
  direction: OrderDirection;
  field: Scalars['String'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Project = {
  __typename?: 'Project';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ProjectConnection = {
  __typename?: 'ProjectConnection';
  edges?: Maybe<Array<ProjectEdge>>;
  nodes?: Maybe<Array<Project>>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type ProjectEdge = {
  __typename?: 'ProjectEdge';
  cursor: Scalars['String'];
  node: Project;
};

export type Query = {
  __typename?: 'Query';
  chart: Chart;
  charts: ChartConnection;
  clip: Clip;
  clips: ClipConnection;
  project: Project;
  projects: ProjectConnection;
  source: Source;
  sources: SourceConnection;
};


export type QueryChartArgs = {
  id: Scalars['ID'];
};


export type QueryChartsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Ordering>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
};


export type QueryClipArgs = {
  id: Scalars['ID'];
};


export type QueryClipsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Ordering>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
};


export type QueryProjectArgs = {
  id: Scalars['ID'];
};


export type QueryProjectsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Ordering>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
};


export type QuerySourceArgs = {
  id: Scalars['ID'];
};


export type QuerySourcesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Ordering>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
};

export type Result = {
  __typename?: 'Result';
  createdAt: Scalars['DateTime'];
  duration: Scalars['Int'];
  error?: Maybe<Scalars['String']>;
  fields: Array<Scalars['String']>;
  finishedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  startedAt?: Maybe<Scalars['DateTime']>;
  updatedAt: Scalars['DateTime'];
  values: Array<Array<Scalars['String']>>;
};

export type ResultConnection = {
  __typename?: 'ResultConnection';
  edges?: Maybe<Array<ResultEdge>>;
  nodes?: Maybe<Array<Result>>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type ResultEdge = {
  __typename?: 'ResultEdge';
  cursor: Scalars['String'];
  node: Result;
};

export type Source = DatabaseSource | VirtualSource;

export type SourceConnection = {
  __typename?: 'SourceConnection';
  edges?: Maybe<Array<SourceEdge>>;
  nodes?: Maybe<Array<Source>>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type SourceEdge = {
  __typename?: 'SourceEdge';
  cursor: Scalars['String'];
  node: Source;
};

export enum SourceType {
  MYSQL = 'MYSQL',
  POSTGRESQL = 'POSTGRESQL',
  VIRTUAL = 'VIRTUAL'
}

export type UpdateChartInput = {
  clipId: Scalars['ID'];
  config: Scalars['JSONObject'];
  name?: InputMaybe<Scalars['String']>;
  type: ChartType;
};

export type UpdateClipInput = {
  name?: InputMaybe<Scalars['String']>;
  sourceId?: InputMaybe<Scalars['ID']>;
  sql?: InputMaybe<Scalars['String']>;
};

export type UpdateDatabaseSourceInput = {
  database?: InputMaybe<Scalars['String']>;
  host?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  port?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<SourceType>;
  username?: InputMaybe<Scalars['String']>;
};

export type UpdateProjectInput = {
  name: Scalars['String'];
};

export type UpdateVirtualSourceInput = {
  name?: InputMaybe<Scalars['String']>;
  tables: Array<UpdateVirtualSourceTableInput>;
};

export type UpdateVirtualSourceTableInput = {
  clipId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type VirtualSource = {
  __typename?: 'VirtualSource';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  tables: Array<VirtualSourceTable>;
  updatedAt: Scalars['DateTime'];
};

export type VirtualSourceTable = {
  __typename?: 'VirtualSourceTable';
  clip: Clip;
  clipId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  virtualSource: VirtualSource;
  virtualSourceId: Scalars['ID'];
};

export type ChartFragment = { __typename?: 'Chart', id: string, name: string, token?: string | null, type: ChartType, config: any, clipId: string, createdAt: any, updatedAt: any };

export type ClipFragment = { __typename?: 'Clip', id: string, name: string, token?: string | null, sql: string, sourceId: string, createdAt: any, updatedAt: any };

export type DatabaseSourceFragment = { __typename?: 'DatabaseSource', id: string, name: string, type: DatabaseType, host: string, port?: number | null, database?: string | null, username: string, createdAt: any, updatedAt: any };

export type ResultFragment = { __typename?: 'Result', id: string, name: string, error?: string | null, fields: Array<string>, values: Array<Array<string>>, duration: number, startedAt?: any | null, finishedAt?: any | null };

type Source_DatabaseSource_Fragment = { __typename?: 'DatabaseSource', id: string, name: string, type: DatabaseType, host: string, port?: number | null, database?: string | null, username: string, createdAt: any, updatedAt: any };

type Source_VirtualSource_Fragment = { __typename?: 'VirtualSource', id: string, name: string, createdAt: any, updatedAt: any, tables: Array<{ __typename?: 'VirtualSourceTable', id: string, name: string, clipId: string, createdAt: any, updatedAt: any }> };

export type SourceFragment = Source_DatabaseSource_Fragment | Source_VirtualSource_Fragment;

export type VirtualSourceFragment = { __typename?: 'VirtualSource', id: string, name: string, createdAt: any, updatedAt: any, tables: Array<{ __typename?: 'VirtualSourceTable', id: string, name: string, clipId: string, createdAt: any, updatedAt: any }> };

export type CreateChartMutationVariables = Exact<{
  input: CreateChartInput;
}>;


export type CreateChartMutation = { __typename?: 'Mutation', createChart: { __typename?: 'Chart', id: string, name: string, token?: string | null, type: ChartType, config: any, clipId: string, createdAt: any, updatedAt: any } };

export type CreateClipMutationVariables = Exact<{
  input: CreateClipInput;
}>;


export type CreateClipMutation = { __typename?: 'Mutation', createClip: { __typename?: 'Clip', id: string, name: string, token?: string | null, sql: string, sourceId: string, createdAt: any, updatedAt: any } };

export type CreateDatabaseSourceMutationVariables = Exact<{
  input: CreateDatabaseSourceInput;
}>;


export type CreateDatabaseSourceMutation = { __typename?: 'Mutation', createDatabaseSource: { __typename?: 'DatabaseSource', id: string, name: string, type: DatabaseType, host: string, port?: number | null, database?: string | null, username: string, createdAt: any, updatedAt: any } };

export type CreateVirtualSourceMutationVariables = Exact<{
  input: CreateVirtualSourceInput;
}>;


export type CreateVirtualSourceMutation = { __typename?: 'Mutation', createVirtualSource: { __typename?: 'VirtualSource', id: string, name: string, createdAt: any, updatedAt: any, tables: Array<{ __typename?: 'VirtualSourceTable', id: string, name: string, clipId: string, createdAt: any, updatedAt: any }> } };

export type DeleteChartMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteChartMutation = { __typename?: 'Mutation', deleteChart: string };

export type DeleteClipMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteClipMutation = { __typename?: 'Mutation', deleteClip: string };

export type DeleteSourceMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteSourceMutation = { __typename?: 'Mutation', deleteSource: string };

export type UpdateChartMutationVariables = Exact<{
  id: Scalars['ID'];
  input: UpdateChartInput;
}>;


export type UpdateChartMutation = { __typename?: 'Mutation', updateChart: { __typename?: 'Chart', id: string, name: string, token?: string | null, type: ChartType, config: any, clipId: string, createdAt: any, updatedAt: any } };

export type UpdateClipMutationVariables = Exact<{
  id: Scalars['ID'];
  input: UpdateClipInput;
}>;


export type UpdateClipMutation = { __typename?: 'Mutation', updateClip: { __typename?: 'Clip', id: string, name: string, token?: string | null, sql: string, sourceId: string, createdAt: any, updatedAt: any } };

export type UpdateDatabaseSourceMutationVariables = Exact<{
  id: Scalars['ID'];
  input: UpdateDatabaseSourceInput;
}>;


export type UpdateDatabaseSourceMutation = { __typename?: 'Mutation', updateDatabaseSource: { __typename?: 'DatabaseSource', id: string, name: string, type: DatabaseType, host: string, port?: number | null, database?: string | null, username: string, createdAt: any, updatedAt: any } };

export type UpdateVirtualSourceMutationVariables = Exact<{
  id: Scalars['ID'];
  input: UpdateVirtualSourceInput;
}>;


export type UpdateVirtualSourceMutation = { __typename?: 'Mutation', updateVirtualSource: { __typename?: 'VirtualSource', id: string, name: string, createdAt: any, updatedAt: any, tables: Array<{ __typename?: 'VirtualSourceTable', id: string, name: string, createdAt: any, updatedAt: any }> } };

export type ChartQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ChartQuery = { __typename?: 'Query', chart: { __typename?: 'Chart', id: string, name: string, token?: string | null, type: ChartType, config: any, clipId: string, createdAt: any, updatedAt: any } };

export type ChartConnectionQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  query?: InputMaybe<Scalars['String']>;
  orderBy?: InputMaybe<Ordering>;
}>;


export type ChartConnectionQuery = { __typename?: 'Query', chartConnection: { __typename?: 'ChartConnection', totalCount?: number | null, edges?: Array<{ __typename?: 'ChartEdge', node: { __typename?: 'Chart', id: string, name: string, token?: string | null, type: ChartType, config: any, clipId: string, createdAt: any, updatedAt: any } }> | null, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } };

export type ClipQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ClipQuery = { __typename?: 'Query', clip: { __typename?: 'Clip', id: string, name: string, token?: string | null, sql: string, sourceId: string, createdAt: any, updatedAt: any } };

export type ClipConnectionQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  query?: InputMaybe<Scalars['String']>;
  orderBy?: InputMaybe<Ordering>;
}>;


export type ClipConnectionQuery = { __typename?: 'Query', clipConnection: { __typename?: 'ClipConnection', totalCount?: number | null, edges?: Array<{ __typename?: 'ClipEdge', node: { __typename?: 'Clip', id: string, name: string, createdAt: any, updatedAt: any } }> | null, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } };

export type SourceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SourceQuery = { __typename?: 'Query', source: { __typename?: 'DatabaseSource', id: string, name: string, type: DatabaseType, host: string, port?: number | null, database?: string | null, username: string, createdAt: any, updatedAt: any } | { __typename?: 'VirtualSource', id: string, name: string, createdAt: any, updatedAt: any, tables: Array<{ __typename?: 'VirtualSourceTable', id: string, name: string, clipId: string, createdAt: any, updatedAt: any }> } };

export type SourceConnectionQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  query?: InputMaybe<Scalars['String']>;
  orderBy?: InputMaybe<Ordering>;
}>;


export type SourceConnectionQuery = { __typename?: 'Query', sourceConnection: { __typename?: 'SourceConnection', totalCount?: number | null, edges?: Array<{ __typename?: 'SourceEdge', node: { __typename: 'DatabaseSource', id: string, name: string, createdAt: any, updatedAt: any, typename: 'DatabaseSource' } | { __typename: 'VirtualSource', id: string, name: string, createdAt: any, updatedAt: any, typename: 'VirtualSource', tables: Array<{ __typename?: 'VirtualSourceTable', name: string, clipId: string }> } }> | null, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } };

export const ChartFragmentDoc = gql`
    fragment Chart on Chart {
  id
  name
  token
  type
  config
  clipId
  createdAt
  updatedAt
}
    `;
export const ClipFragmentDoc = gql`
    fragment Clip on Clip {
  id
  name
  token
  sql
  sourceId
  createdAt
  updatedAt
}
    `;
export const ResultFragmentDoc = gql`
    fragment Result on Result {
  id
  name
  error
  fields
  values
  duration
  startedAt
  finishedAt
}
    `;
export const DatabaseSourceFragmentDoc = gql`
    fragment DatabaseSource on DatabaseSource {
  id
  name
  type
  host
  port
  database
  username
  createdAt
  updatedAt
}
    `;
export const VirtualSourceFragmentDoc = gql`
    fragment VirtualSource on VirtualSource {
  id
  name
  tables {
    id
    name
    clipId
    createdAt
    updatedAt
  }
  createdAt
  updatedAt
}
    `;
export const SourceFragmentDoc = gql`
    fragment Source on Source {
  ...DatabaseSource
  ...VirtualSource
}
    ${DatabaseSourceFragmentDoc}
${VirtualSourceFragmentDoc}`;
export const CreateChartDocument = gql`
    mutation CreateChart($input: CreateChartInput!) {
  createChart(input: $input) {
    ...Chart
  }
}
    ${ChartFragmentDoc}`;
export type CreateChartMutationFn = Apollo.MutationFunction<CreateChartMutation, CreateChartMutationVariables>;

/**
 * __useCreateChartMutation__
 *
 * To run a mutation, you first call `useCreateChartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChartMutation, { data, loading, error }] = useCreateChartMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateChartMutation(baseOptions?: Apollo.MutationHookOptions<CreateChartMutation, CreateChartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChartMutation, CreateChartMutationVariables>(CreateChartDocument, options);
      }
export type CreateChartMutationHookResult = ReturnType<typeof useCreateChartMutation>;
export type CreateChartMutationResult = Apollo.MutationResult<CreateChartMutation>;
export type CreateChartMutationOptions = Apollo.BaseMutationOptions<CreateChartMutation, CreateChartMutationVariables>;
export const CreateClipDocument = gql`
    mutation CreateClip($input: CreateClipInput!) {
  createClip(input: $input) {
    ...Clip
  }
}
    ${ClipFragmentDoc}`;
export type CreateClipMutationFn = Apollo.MutationFunction<CreateClipMutation, CreateClipMutationVariables>;

/**
 * __useCreateClipMutation__
 *
 * To run a mutation, you first call `useCreateClipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClipMutation, { data, loading, error }] = useCreateClipMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateClipMutation(baseOptions?: Apollo.MutationHookOptions<CreateClipMutation, CreateClipMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateClipMutation, CreateClipMutationVariables>(CreateClipDocument, options);
      }
export type CreateClipMutationHookResult = ReturnType<typeof useCreateClipMutation>;
export type CreateClipMutationResult = Apollo.MutationResult<CreateClipMutation>;
export type CreateClipMutationOptions = Apollo.BaseMutationOptions<CreateClipMutation, CreateClipMutationVariables>;
export const CreateDatabaseSourceDocument = gql`
    mutation CreateDatabaseSource($input: CreateDatabaseSourceInput!) {
  createDatabaseSource(input: $input) {
    ...DatabaseSource
  }
}
    ${DatabaseSourceFragmentDoc}`;
export type CreateDatabaseSourceMutationFn = Apollo.MutationFunction<CreateDatabaseSourceMutation, CreateDatabaseSourceMutationVariables>;

/**
 * __useCreateDatabaseSourceMutation__
 *
 * To run a mutation, you first call `useCreateDatabaseSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDatabaseSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDatabaseSourceMutation, { data, loading, error }] = useCreateDatabaseSourceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDatabaseSourceMutation(baseOptions?: Apollo.MutationHookOptions<CreateDatabaseSourceMutation, CreateDatabaseSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDatabaseSourceMutation, CreateDatabaseSourceMutationVariables>(CreateDatabaseSourceDocument, options);
      }
export type CreateDatabaseSourceMutationHookResult = ReturnType<typeof useCreateDatabaseSourceMutation>;
export type CreateDatabaseSourceMutationResult = Apollo.MutationResult<CreateDatabaseSourceMutation>;
export type CreateDatabaseSourceMutationOptions = Apollo.BaseMutationOptions<CreateDatabaseSourceMutation, CreateDatabaseSourceMutationVariables>;
export const CreateVirtualSourceDocument = gql`
    mutation CreateVirtualSource($input: CreateVirtualSourceInput!) {
  createVirtualSource(input: $input) {
    ...VirtualSource
  }
}
    ${VirtualSourceFragmentDoc}`;
export type CreateVirtualSourceMutationFn = Apollo.MutationFunction<CreateVirtualSourceMutation, CreateVirtualSourceMutationVariables>;

/**
 * __useCreateVirtualSourceMutation__
 *
 * To run a mutation, you first call `useCreateVirtualSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVirtualSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVirtualSourceMutation, { data, loading, error }] = useCreateVirtualSourceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateVirtualSourceMutation(baseOptions?: Apollo.MutationHookOptions<CreateVirtualSourceMutation, CreateVirtualSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateVirtualSourceMutation, CreateVirtualSourceMutationVariables>(CreateVirtualSourceDocument, options);
      }
export type CreateVirtualSourceMutationHookResult = ReturnType<typeof useCreateVirtualSourceMutation>;
export type CreateVirtualSourceMutationResult = Apollo.MutationResult<CreateVirtualSourceMutation>;
export type CreateVirtualSourceMutationOptions = Apollo.BaseMutationOptions<CreateVirtualSourceMutation, CreateVirtualSourceMutationVariables>;
export const DeleteChartDocument = gql`
    mutation DeleteChart($id: ID!) {
  deleteChart(id: $id)
}
    `;
export type DeleteChartMutationFn = Apollo.MutationFunction<DeleteChartMutation, DeleteChartMutationVariables>;

/**
 * __useDeleteChartMutation__
 *
 * To run a mutation, you first call `useDeleteChartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChartMutation, { data, loading, error }] = useDeleteChartMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteChartMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChartMutation, DeleteChartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChartMutation, DeleteChartMutationVariables>(DeleteChartDocument, options);
      }
export type DeleteChartMutationHookResult = ReturnType<typeof useDeleteChartMutation>;
export type DeleteChartMutationResult = Apollo.MutationResult<DeleteChartMutation>;
export type DeleteChartMutationOptions = Apollo.BaseMutationOptions<DeleteChartMutation, DeleteChartMutationVariables>;
export const DeleteClipDocument = gql`
    mutation DeleteClip($id: ID!) {
  deleteClip(id: $id)
}
    `;
export type DeleteClipMutationFn = Apollo.MutationFunction<DeleteClipMutation, DeleteClipMutationVariables>;

/**
 * __useDeleteClipMutation__
 *
 * To run a mutation, you first call `useDeleteClipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClipMutation, { data, loading, error }] = useDeleteClipMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteClipMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClipMutation, DeleteClipMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteClipMutation, DeleteClipMutationVariables>(DeleteClipDocument, options);
      }
export type DeleteClipMutationHookResult = ReturnType<typeof useDeleteClipMutation>;
export type DeleteClipMutationResult = Apollo.MutationResult<DeleteClipMutation>;
export type DeleteClipMutationOptions = Apollo.BaseMutationOptions<DeleteClipMutation, DeleteClipMutationVariables>;
export const DeleteSourceDocument = gql`
    mutation DeleteSource($id: ID!) {
  deleteSource(id: $id)
}
    `;
export type DeleteSourceMutationFn = Apollo.MutationFunction<DeleteSourceMutation, DeleteSourceMutationVariables>;

/**
 * __useDeleteSourceMutation__
 *
 * To run a mutation, you first call `useDeleteSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSourceMutation, { data, loading, error }] = useDeleteSourceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSourceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSourceMutation, DeleteSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSourceMutation, DeleteSourceMutationVariables>(DeleteSourceDocument, options);
      }
export type DeleteSourceMutationHookResult = ReturnType<typeof useDeleteSourceMutation>;
export type DeleteSourceMutationResult = Apollo.MutationResult<DeleteSourceMutation>;
export type DeleteSourceMutationOptions = Apollo.BaseMutationOptions<DeleteSourceMutation, DeleteSourceMutationVariables>;
export const UpdateChartDocument = gql`
    mutation UpdateChart($id: ID!, $input: UpdateChartInput!) {
  updateChart(id: $id, input: $input) {
    ...Chart
  }
}
    ${ChartFragmentDoc}`;
export type UpdateChartMutationFn = Apollo.MutationFunction<UpdateChartMutation, UpdateChartMutationVariables>;

/**
 * __useUpdateChartMutation__
 *
 * To run a mutation, you first call `useUpdateChartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChartMutation, { data, loading, error }] = useUpdateChartMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateChartMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChartMutation, UpdateChartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChartMutation, UpdateChartMutationVariables>(UpdateChartDocument, options);
      }
export type UpdateChartMutationHookResult = ReturnType<typeof useUpdateChartMutation>;
export type UpdateChartMutationResult = Apollo.MutationResult<UpdateChartMutation>;
export type UpdateChartMutationOptions = Apollo.BaseMutationOptions<UpdateChartMutation, UpdateChartMutationVariables>;
export const UpdateClipDocument = gql`
    mutation UpdateClip($id: ID!, $input: UpdateClipInput!) {
  updateClip(id: $id, input: $input) {
    ...Clip
  }
}
    ${ClipFragmentDoc}`;
export type UpdateClipMutationFn = Apollo.MutationFunction<UpdateClipMutation, UpdateClipMutationVariables>;

/**
 * __useUpdateClipMutation__
 *
 * To run a mutation, you first call `useUpdateClipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClipMutation, { data, loading, error }] = useUpdateClipMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateClipMutation(baseOptions?: Apollo.MutationHookOptions<UpdateClipMutation, UpdateClipMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateClipMutation, UpdateClipMutationVariables>(UpdateClipDocument, options);
      }
export type UpdateClipMutationHookResult = ReturnType<typeof useUpdateClipMutation>;
export type UpdateClipMutationResult = Apollo.MutationResult<UpdateClipMutation>;
export type UpdateClipMutationOptions = Apollo.BaseMutationOptions<UpdateClipMutation, UpdateClipMutationVariables>;
export const UpdateDatabaseSourceDocument = gql`
    mutation UpdateDatabaseSource($id: ID!, $input: UpdateDatabaseSourceInput!) {
  updateDatabaseSource(id: $id, input: $input) {
    id
    name
    type
    host
    port
    database
    username
    createdAt
    updatedAt
  }
}
    `;
export type UpdateDatabaseSourceMutationFn = Apollo.MutationFunction<UpdateDatabaseSourceMutation, UpdateDatabaseSourceMutationVariables>;

/**
 * __useUpdateDatabaseSourceMutation__
 *
 * To run a mutation, you first call `useUpdateDatabaseSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDatabaseSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDatabaseSourceMutation, { data, loading, error }] = useUpdateDatabaseSourceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDatabaseSourceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDatabaseSourceMutation, UpdateDatabaseSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDatabaseSourceMutation, UpdateDatabaseSourceMutationVariables>(UpdateDatabaseSourceDocument, options);
      }
export type UpdateDatabaseSourceMutationHookResult = ReturnType<typeof useUpdateDatabaseSourceMutation>;
export type UpdateDatabaseSourceMutationResult = Apollo.MutationResult<UpdateDatabaseSourceMutation>;
export type UpdateDatabaseSourceMutationOptions = Apollo.BaseMutationOptions<UpdateDatabaseSourceMutation, UpdateDatabaseSourceMutationVariables>;
export const UpdateVirtualSourceDocument = gql`
    mutation UpdateVirtualSource($id: ID!, $input: UpdateVirtualSourceInput!) {
  updateVirtualSource(id: $id, input: $input) {
    id
    name
    tables {
      id
      name
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
    `;
export type UpdateVirtualSourceMutationFn = Apollo.MutationFunction<UpdateVirtualSourceMutation, UpdateVirtualSourceMutationVariables>;

/**
 * __useUpdateVirtualSourceMutation__
 *
 * To run a mutation, you first call `useUpdateVirtualSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVirtualSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVirtualSourceMutation, { data, loading, error }] = useUpdateVirtualSourceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateVirtualSourceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVirtualSourceMutation, UpdateVirtualSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVirtualSourceMutation, UpdateVirtualSourceMutationVariables>(UpdateVirtualSourceDocument, options);
      }
export type UpdateVirtualSourceMutationHookResult = ReturnType<typeof useUpdateVirtualSourceMutation>;
export type UpdateVirtualSourceMutationResult = Apollo.MutationResult<UpdateVirtualSourceMutation>;
export type UpdateVirtualSourceMutationOptions = Apollo.BaseMutationOptions<UpdateVirtualSourceMutation, UpdateVirtualSourceMutationVariables>;
export const ChartDocument = gql`
    query Chart($id: ID!) {
  chart(id: $id) {
    ...Chart
  }
}
    ${ChartFragmentDoc}`;

/**
 * __useChartQuery__
 *
 * To run a query within a React component, call `useChartQuery` and pass it any options that fit your needs.
 * When your component renders, `useChartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChartQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChartQuery(baseOptions: Apollo.QueryHookOptions<ChartQuery, ChartQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChartQuery, ChartQueryVariables>(ChartDocument, options);
      }
export function useChartLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChartQuery, ChartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChartQuery, ChartQueryVariables>(ChartDocument, options);
        }
export type ChartQueryHookResult = ReturnType<typeof useChartQuery>;
export type ChartLazyQueryHookResult = ReturnType<typeof useChartLazyQuery>;
export type ChartQueryResult = Apollo.QueryResult<ChartQuery, ChartQueryVariables>;
export const ChartConnectionDocument = gql`
    query ChartConnection($first: Int, $last: Int, $before: String, $after: String, $query: String, $orderBy: Ordering) {
  chartConnection: charts(
    first: $first
    last: $last
    before: $before
    after: $after
    query: $query
    orderBy: $orderBy
  ) {
    edges {
      node {
        ...Chart
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    totalCount
  }
}
    ${ChartFragmentDoc}`;

/**
 * __useChartConnectionQuery__
 *
 * To run a query within a React component, call `useChartConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useChartConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChartConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      query: // value for 'query'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useChartConnectionQuery(baseOptions?: Apollo.QueryHookOptions<ChartConnectionQuery, ChartConnectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChartConnectionQuery, ChartConnectionQueryVariables>(ChartConnectionDocument, options);
      }
export function useChartConnectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChartConnectionQuery, ChartConnectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChartConnectionQuery, ChartConnectionQueryVariables>(ChartConnectionDocument, options);
        }
export type ChartConnectionQueryHookResult = ReturnType<typeof useChartConnectionQuery>;
export type ChartConnectionLazyQueryHookResult = ReturnType<typeof useChartConnectionLazyQuery>;
export type ChartConnectionQueryResult = Apollo.QueryResult<ChartConnectionQuery, ChartConnectionQueryVariables>;
export const ClipDocument = gql`
    query Clip($id: ID!) {
  clip(id: $id) {
    ...Clip
  }
}
    ${ClipFragmentDoc}`;

/**
 * __useClipQuery__
 *
 * To run a query within a React component, call `useClipQuery` and pass it any options that fit your needs.
 * When your component renders, `useClipQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClipQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useClipQuery(baseOptions: Apollo.QueryHookOptions<ClipQuery, ClipQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClipQuery, ClipQueryVariables>(ClipDocument, options);
      }
export function useClipLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClipQuery, ClipQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClipQuery, ClipQueryVariables>(ClipDocument, options);
        }
export type ClipQueryHookResult = ReturnType<typeof useClipQuery>;
export type ClipLazyQueryHookResult = ReturnType<typeof useClipLazyQuery>;
export type ClipQueryResult = Apollo.QueryResult<ClipQuery, ClipQueryVariables>;
export const ClipConnectionDocument = gql`
    query ClipConnection($first: Int, $last: Int, $before: String, $after: String, $query: String, $orderBy: Ordering) {
  clipConnection: clips(
    first: $first
    last: $last
    before: $before
    after: $after
    query: $query
    orderBy: $orderBy
  ) {
    edges {
      node {
        id
        name
        createdAt
        updatedAt
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    totalCount
  }
}
    `;

/**
 * __useClipConnectionQuery__
 *
 * To run a query within a React component, call `useClipConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useClipConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClipConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      query: // value for 'query'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useClipConnectionQuery(baseOptions?: Apollo.QueryHookOptions<ClipConnectionQuery, ClipConnectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ClipConnectionQuery, ClipConnectionQueryVariables>(ClipConnectionDocument, options);
      }
export function useClipConnectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClipConnectionQuery, ClipConnectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ClipConnectionQuery, ClipConnectionQueryVariables>(ClipConnectionDocument, options);
        }
export type ClipConnectionQueryHookResult = ReturnType<typeof useClipConnectionQuery>;
export type ClipConnectionLazyQueryHookResult = ReturnType<typeof useClipConnectionLazyQuery>;
export type ClipConnectionQueryResult = Apollo.QueryResult<ClipConnectionQuery, ClipConnectionQueryVariables>;
export const SourceDocument = gql`
    query Source($id: ID!) {
  source(id: $id) {
    ...VirtualSource
    ...DatabaseSource
  }
}
    ${VirtualSourceFragmentDoc}
${DatabaseSourceFragmentDoc}`;

/**
 * __useSourceQuery__
 *
 * To run a query within a React component, call `useSourceQuery` and pass it any options that fit your needs.
 * When your component renders, `useSourceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSourceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSourceQuery(baseOptions: Apollo.QueryHookOptions<SourceQuery, SourceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SourceQuery, SourceQueryVariables>(SourceDocument, options);
      }
export function useSourceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SourceQuery, SourceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SourceQuery, SourceQueryVariables>(SourceDocument, options);
        }
export type SourceQueryHookResult = ReturnType<typeof useSourceQuery>;
export type SourceLazyQueryHookResult = ReturnType<typeof useSourceLazyQuery>;
export type SourceQueryResult = Apollo.QueryResult<SourceQuery, SourceQueryVariables>;
export const SourceConnectionDocument = gql`
    query SourceConnection($first: Int, $last: Int, $before: String, $after: String, $query: String, $orderBy: Ordering) {
  sourceConnection: sources(
    first: $first
    last: $last
    before: $before
    after: $after
    query: $query
    orderBy: $orderBy
  ) {
    edges {
      node {
        __typename
        typename: __typename
        ... on DatabaseSource {
          id
          name
          createdAt
          updatedAt
        }
        ... on VirtualSource {
          id
          name
          createdAt
          updatedAt
          tables {
            name
            clipId
          }
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    totalCount
  }
}
    `;

/**
 * __useSourceConnectionQuery__
 *
 * To run a query within a React component, call `useSourceConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSourceConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSourceConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      query: // value for 'query'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useSourceConnectionQuery(baseOptions?: Apollo.QueryHookOptions<SourceConnectionQuery, SourceConnectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SourceConnectionQuery, SourceConnectionQueryVariables>(SourceConnectionDocument, options);
      }
export function useSourceConnectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SourceConnectionQuery, SourceConnectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SourceConnectionQuery, SourceConnectionQueryVariables>(SourceConnectionDocument, options);
        }
export type SourceConnectionQueryHookResult = ReturnType<typeof useSourceConnectionQuery>;
export type SourceConnectionLazyQueryHookResult = ReturnType<typeof useSourceConnectionLazyQuery>;
export type SourceConnectionQueryResult = Apollo.QueryResult<SourceConnectionQuery, SourceConnectionQueryVariables>;