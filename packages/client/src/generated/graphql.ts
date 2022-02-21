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
};

export type Clip = {
  __typename?: 'Clip';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  sql: Scalars['String'];
  updatedAt: Scalars['DateTime'];
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

export type CreateClipInput = {
  name: Scalars['String'];
  sourceId?: InputMaybe<Scalars['ID']>;
  sql: Scalars['String'];
};

export type CreateProjectInput = {
  name: Scalars['String'];
};

export type CreateSourceInput = {
  database: Scalars['String'];
  host: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  port: Scalars['Int'];
  type: SourceType;
  username: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createClip: Clip;
  createProject: Project;
  createSource: Source;
  deleteClip: Scalars['ID'];
  deleteProject: Scalars['ID'];
  deleteSource: Scalars['ID'];
  updateClip: Clip;
  updateProject: Project;
  updateSource: Source;
};


export type MutationCreateClipArgs = {
  input: CreateClipInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreateSourceArgs = {
  input: CreateSourceInput;
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


export type MutationUpdateClipArgs = {
  id: Scalars['ID'];
  input: UpdateClipInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID'];
  input: UpdateProjectInput;
};


export type MutationUpdateSourceArgs = {
  id: Scalars['ID'];
  input: UpdateSourceInput;
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
  clip: Clip;
  clips: ClipConnection;
  project: Project;
  projects: ProjectConnection;
  source: Source;
  sources: SourceConnection;
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

export type Source = {
  __typename?: 'Source';
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
  POSTGRESQL = 'POSTGRESQL'
}

export type UpdateClipInput = {
  name?: InputMaybe<Scalars['String']>;
  sourceId?: InputMaybe<Scalars['ID']>;
  sql?: InputMaybe<Scalars['String']>;
};

export type UpdateProjectInput = {
  name: Scalars['String'];
};

export type UpdateSourceInput = {
  database?: InputMaybe<Scalars['String']>;
  host?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  port?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<SourceType>;
  username?: InputMaybe<Scalars['String']>;
};

export type ClipFragment = { __typename?: 'Clip', id: string, slug: string, name: string, sql: string, createdAt: any, updatedAt: any };

export type ClipQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ClipQuery = { __typename?: 'Query', clip: { __typename?: 'Clip', id: string, slug: string, name: string, sql: string, createdAt: any, updatedAt: any } };

export const ClipFragmentDoc = gql`
    fragment Clip on Clip {
  id
  slug
  name
  sql
  createdAt
  updatedAt
}
    `;
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