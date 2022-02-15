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
  "possibleTypes": {}
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

export type CreateDataClipInput = {
  name: Scalars['String'];
  sql: Scalars['String'];
};

export type CreateDataSourceInput = {
  database: Scalars['String'];
  host: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  port: Scalars['Int'];
  type: DataSourceType;
  username: Scalars['String'];
};

export type CreateProjectInput = {
  name: Scalars['String'];
};

export type DataClip = {
  __typename?: 'DataClip';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  result: Scalars['JSONObject'];
  sql: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  uuid: Scalars['String'];
};

export type DataClipConnection = {
  __typename?: 'DataClipConnection';
  edges?: Maybe<Array<DataClipEdge>>;
  nodes?: Maybe<Array<DataClip>>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type DataClipEdge = {
  __typename?: 'DataClipEdge';
  cursor: Scalars['String'];
  node: DataClip;
};

export type DataSource = {
  __typename?: 'DataSource';
  createdAt: Scalars['DateTime'];
  database: Scalars['String'];
  host: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  port: Scalars['Float'];
  type: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type DataSourceConnection = {
  __typename?: 'DataSourceConnection';
  edges?: Maybe<Array<DataSourceEdge>>;
  nodes?: Maybe<Array<DataSource>>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type DataSourceEdge = {
  __typename?: 'DataSourceEdge';
  cursor: Scalars['String'];
  node: DataSource;
};

export enum DataSourceType {
  MYSQL = 'MYSQL',
  POSTGRESQL = 'POSTGRESQL'
}

export type Mutation = {
  __typename?: 'Mutation';
  createDataClip: DataClip;
  createDataSource: DataSource;
  createProject: Project;
  deleteDataClip: Scalars['ID'];
  deleteDataSource: Scalars['ID'];
  deleteProject: Scalars['ID'];
  updateDataClip: DataClip;
  updateDataSource: DataSource;
  updateProject: Project;
};


export type MutationCreateDataClipArgs = {
  input: CreateDataClipInput;
};


export type MutationCreateDataSourceArgs = {
  input: CreateDataSourceInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationDeleteDataClipArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDataSourceArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateDataClipArgs = {
  id: Scalars['ID'];
  input: UpdateDataClipInput;
};


export type MutationUpdateDataSourceArgs = {
  id: Scalars['ID'];
  input: UpdateDataSourceInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID'];
  input: UpdateProjectInput;
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
  dataClip: DataClip;
  dataClips: DataClipConnection;
  dataSource: DataSource;
  dataSources: DataSourceConnection;
  project: Project;
  projects: ProjectConnection;
};


export type QueryDataClipArgs = {
  id: Scalars['ID'];
};


export type QueryDataClipsArgs = {
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


export type QueryDataSourceArgs = {
  id: Scalars['ID'];
};


export type QueryDataSourcesArgs = {
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

export type UpdateDataClipInput = {
  name?: InputMaybe<Scalars['String']>;
  sql?: InputMaybe<Scalars['String']>;
};

export type UpdateDataSourceInput = {
  database?: InputMaybe<Scalars['String']>;
  host?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  port?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<DataSourceType>;
  username?: InputMaybe<Scalars['String']>;
};

export type UpdateProjectInput = {
  name: Scalars['String'];
};

export type DataClipFragment = { __typename?: 'DataClip', id: string, uuid: string, name: string, sql: string, result: any, createdAt: any, updatedAt: any };

export type DataClipQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DataClipQuery = { __typename?: 'Query', dataClip: { __typename?: 'DataClip', id: string, uuid: string, name: string, sql: string, result: any, createdAt: any, updatedAt: any } };

export const DataClipFragmentDoc = gql`
    fragment DataClip on DataClip {
  id
  uuid
  name
  sql
  result
  createdAt
  updatedAt
}
    `;
export const DataClipDocument = gql`
    query DataClip($id: ID!) {
  dataClip(id: $id) {
    ...DataClip
  }
}
    ${DataClipFragmentDoc}`;

/**
 * __useDataClipQuery__
 *
 * To run a query within a React component, call `useDataClipQuery` and pass it any options that fit your needs.
 * When your component renders, `useDataClipQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDataClipQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDataClipQuery(baseOptions: Apollo.QueryHookOptions<DataClipQuery, DataClipQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DataClipQuery, DataClipQueryVariables>(DataClipDocument, options);
      }
export function useDataClipLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DataClipQuery, DataClipQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DataClipQuery, DataClipQueryVariables>(DataClipDocument, options);
        }
export type DataClipQueryHookResult = ReturnType<typeof useDataClipQuery>;
export type DataClipLazyQueryHookResult = ReturnType<typeof useDataClipLazyQuery>;
export type DataClipQueryResult = Apollo.QueryResult<DataClipQuery, DataClipQueryVariables>;