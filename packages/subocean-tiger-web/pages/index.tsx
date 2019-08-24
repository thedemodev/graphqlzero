import { ApolloProvider, useMutation, useQuery } from '@apollo/react-hooks';
import ApolloClient, { ApolloError, gql } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import Prism from 'prismjs';
import React, { useEffect, useState } from 'react';
import ExampleQuery, { getExampleQueries } from '../lib/example-query';
import prismGraphql from '../lib/prism-graphql';
import prismJson from '../lib/prism-json';

const Index = withApolloClient(
  function Index () {
    Prism.languages.graphql = prismGraphql;
    Prism.languages.json = prismJson;
    return (
      <div>
        <TopBar />
        <Header />
        <Main />
        <Footer />
        <style jsx global>{`
          html, body {
            font-family: 'Raleway', sans-serif;
          }
          html, body {
            margin: 0;
            padding: 0;
          }
          pre {
            min-height: 120px;
            max-height: 300px;
            padding: 1em;
            margin: .5em 0;
            overflow: auto;
            background: #f5f2f0;
          }
          code {
            color: black;
            background: none;
            text-shadow: 0 1px white;
            font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
            font-size: 1em;
            text-align: left;
            white-space: pre;
            word-spacing: normal;
            word-break: normal;
            word-wrap: normal;
            line-height: 1.5;
            -moz-tab-size: 4;
            -o-tab-size: 4;
            tab-size: 4;
            -webkit-hyphens: none;
            -moz-hyphens: none;
            -ms-hyphens: none;
            -webkit-hyphens: none;
            -moz-hyphens: none;
            -ms-hyphens: none;
            hyphens: none;
          }
        `}</style>
        <style jsx global>{`
            /**
            * prism.js default theme for JavaScript, CSS and HTML
            * Based on dabblet (http://dabblet.com)
            * @author Lea Verou
            */

            code[class*="language-"],
            pre[class*="language-"] {
              color: black;
              background: none;
              text-shadow: 0 1px white;
              font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
              font-size: 1em;
              text-align: left;
              white-space: pre;
              word-spacing: normal;
              word-break: normal;
              word-wrap: normal;
              line-height: 1.5;

              -moz-tab-size: 4;
              -o-tab-size: 4;
              tab-size: 4;

              -webkit-hyphens: none;
              -moz-hyphens: none;
              -ms-hyphens: none;
              hyphens: none;
            }

            pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
            code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
              text-shadow: none;
              background: #b3d4fc;
            }

            pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
            code[class*="language-"]::selection, code[class*="language-"] ::selection {
              text-shadow: none;
              background: #b3d4fc;
            }

            @media print {
              code[class*="language-"],
              pre[class*="language-"] {
                text-shadow: none;
              }
            }

            /* Code blocks */
            pre[class*="language-"] {
              padding: 1em;
              margin: .5em 0;
              overflow: auto;
            }

            :not(pre) > code[class*="language-"],
            pre[class*="language-"] {
              background: #f5f2f0;
            }

            /* Inline code */
            :not(pre) > code[class*="language-"] {
              padding: .1em;
              border-radius: .3em;
              white-space: normal;
            }

            .token.comment,
            .token.prolog,
            .token.doctype,
            .token.cdata {
              color: slategray;
            }

            .token.punctuation {
              color: #999;
            }

            .namespace {
              opacity: .7;
            }

            .token.property,
            .token.tag,
            .token.boolean,
            .token.number,
            .token.constant,
            .token.symbol,
            .token.deleted {
              color: #905;
            }

            .token.selector,
            .token.attr-name,
            .token.string,
            .token.char,
            .token.builtin,
            .token.inserted {
              color: #690;
            }

            .token.operator,
            .token.entity,
            .token.url,
            .language-css .token.string,
            .style .token.string {
              color: #9a6e3a;
              background: hsla(0, 0%, 100%, .5);
            }

            .token.atrule,
            .token.attr-value,
            .token.keyword {
              color: #07a;
            }

            .token.function,
            .token.class-name {
              color: #DD4A68;
            }

            .token.regex,
            .token.important,
            .token.variable {
              color: #e90;
            }

            .token.important,
            .token.bold {
              font-weight: bold;
            }
            .token.italic {
              font-style: italic;
            }

            .token.entity {
              cursor: help;
            }

          `}</style>
          <style jsx global>{`
            /* latin */
            @font-face {
              font-family: 'Raleway';
              font-style: normal;
              font-weight: 400;
              src: local('Raleway'), local('Raleway-Regular'), url(data:font/woff2;base64,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) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
          `}</style>
      </div>
    );
  }
);

function withApolloClient (Component: React.ComponentType) {
  const GRAPHQL_SERVER_URL = process.env.GRAPHQL_SERVER_URL;
  if (GRAPHQL_SERVER_URL === undefined) {
    throw new Error('Missing environment variable GRAPHQL_SERVER_URL.');
  }
  const client = new ApolloClient({
    uri: GRAPHQL_SERVER_URL,
    fetch
  });
	return class extends React.Component {
    render () {
      return (
        <ApolloProvider client={client}>
          <Component { ...this.props }/>
        </ApolloProvider>
      );
    }
	}
}

function TopBar () {
  return (
    <nav>
      <a href="#" className="brand">SuboceanTiger</a>
      <ul>
        <li>
          <a href="#examples">Examples</a>
        </li>
        <li>
          <a href="#get-started">Get Started</a>
        </li>
        <li>
          <a href="https://github.com/ealmansi" target="_blank" rel="noopener">Github</a>
        </li>
      </ul>
      <style jsx>{`
        nav {
          padding: 20px 10px;
          border-bottom: 1px solid lightgray;
          overflow: auto;
        }
        a {
          padding: 20px 10px;
          text-decoration: none;
          color: black;
        }
        a:hover {
          text-decoration: underline;
        }
        @media screen and (max-width: 480px) {
          nav .brand {
            display: none;
          }
        }
        nav ul {
          display: inline-block;
          float: right;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        nav ul li {
          display: inline-block;
        }
      `}</style>
    </nav>
  )
}

function Header () {
  return (
    <header>
      <h1>SuboceanTiger</h1>
      <p>Fake Online GraphQL API for Testing and Prototyping</p>
      <p>Powered by JSONPlaceholder</p>
      <style jsx>{`
        header {
          padding: 50px;
          border-bottom: 1px solid lightgray;
          text-align: center;
        }
        header h1 {
          font-size: 64px;
        }
        @media screen and (max-width: 768px) {
          header h1 {
            font-size: 8vw;
          }
        }
      `}</style>
    </header> 
  )
}

function Main () {
  return (
    <main>
      <div>
        <Intro />
        <Examples />
        <GetStarted />
        <Resources />
      </div>
      <style jsx>{`
        main {
          padding: 30px;
          border-bottom: 1px solid lightgray;
        }
        main div {
          max-width: 768px;
          margin: 0 auto;
        }
      `}</style>
    </main> 
  )
}

function Intro () {
  return (
    <section id="intro">
      <h1>Intro</h1>
      <p>
        SuboceanTiger is a free online GraphQL API that you can use whenever you need some fake data.
      </p>
      <p>
        It's great for tutorials, testing new libraries, sharing code examples, ...
      </p>
      <style jsx>{`
        section {
          margin-bottom: 20px;
          padding-top: 20px;
        }
      `}</style>
    </section>
  )
}

function Examples () {
  const [activeQuery, setActiveQuery] = useState('get-post');
  const exampleQueries = getExampleQueries();
  const exampleQuery = exampleQueries.find(({ id }) => id === activeQuery) || exampleQueries[0];
  function buildClassName (id: string): string {
    return id === activeQuery ? 'active' : '';
  }
  function buildOnClickHandler (id: string): ((event: React.MouseEvent) => void) {
    return (event) => {
      setActiveQuery(id);
    }
  }
  return (
    <section id="examples" className="examples">
      <h1>Examples</h1>
      <p>Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
      <div className="columns">
        <div className="column left-column">
          <ul>
            {
              exampleQueries.map((exampleQuery) => {
                const { id, label } = exampleQuery;
                return (
                  <li key={id} className={buildClassName(id)}>
                    <a href="#example-query" onClick={buildOnClickHandler(id)}>{label}</a>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className="column right-column">
          <section id="example-query">
            <h1>Query or Mutation</h1>
            <QueryDisplay exampleQuery={exampleQuery}/>
          </section>
          <section>
            <h1>Response</h1>
            <ResponseDisplay exampleQuery={exampleQuery}/>
          </section>
        </div>
      </div>
      <style jsx>{`
        .examples {
          margin-bottom: 20px;
          padding-top: 20px;
        }
        .examples .columns {
          margin-top: 50px;
          padding: 0 20px 20px 20px;
          border: 1px solid lightgray;
        }
        .examples .columns .column {
          vertical-align: top;
          margin: 0;
          padding: 0;
          display: inline-block;
        }
        @media screen and (max-width: 667px) {
          .examples .columns .column {
            display: block;
          }
        }
        .examples .columns .left-column {
          width: 30%;
        }
        @media screen and (max-width: 667px) {
          .examples .columns .left-column {
            width: 100%;
          }
        }
        .examples .columns .left-column ul {
          margin: 0;
          padding: 30px 0 10px 0;
          list-style: none;
        }
        .examples .columns .left-column ul li a {
          width: calc(100% - 20px);
          padding: 10px;
          display: inline-block;
          color: black;
          text-decoration: none;
          border-bottom: 1px solid lightgray;
        }
        .examples .columns .left-column ul li.active a {
          background: lightgray;
        }
        .examples .columns .left-column ul li:hover a {
          background: lightgray;
        }
        .examples .columns .right-column {
          width: 70%;
        }
        @media screen and (max-width: 667px) {
          .examples .columns .right-column {
            width: 100%;
          }
        }
        .examples .columns .right-column section {
          padding-top: 20px;
          padding-left: 20px;
        }
        @media screen and (max-width: 667px) {
          .examples .columns .right-column section {
            padding-left: 0;
          }
        }
      `}</style>
    </section>
  )
}

function QueryDisplay (props: { exampleQuery: ExampleQuery }) {
  const { exampleQuery } = props;
  const { query } = exampleQuery;
  const codeHtml = Prism.highlight(query, Prism.languages.graphql, 'graphql');
  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: codeHtml }}></code>
    </pre>
  )
}

function ResponseDisplay (props: { exampleQuery: ExampleQuery }) {
  const { exampleQuery } = props;
  const { type, query } = exampleQuery;
  let loading: boolean | undefined, error: ApolloError | undefined, data: any;
  if (type === 'query') {
    const queryResult = useQuery(gql`${query}`);
    ({ loading, error, data } = queryResult);
  }
  else {
    const [_, mutationResult] = useMutation(gql`${query}`);
    ({ loading, error, data } = mutationResult);
  }
  let codeHtml: string | null = null
  if (error !== undefined) {
    codeHtml = Prism.highlight('Oops. Something went wrong.', Prism.languages.markup, 'markup');
  }
  else {
    if (loading) {
      codeHtml = Prism.highlight('Loading ...', Prism.languages.markup, 'markup');
    }
    else {
      const omitTypename = (key: string, value: any) => {
        if (key === '__typename') {
          return undefined;
        }
        return value;
      }
      const dataDisplay = JSON.stringify(data, omitTypename, 2);
      codeHtml = Prism.highlight(dataDisplay, Prism.languages.json, 'json');
    }
  }
  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: codeHtml }}></code>
    </pre>
  )
}

function GetStarted () {
  return (
    <section id="get-started">
      <h1>Get Started</h1>
      <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>
      <style jsx>{`
        section {
          margin-bottom: 20px;
          padding-top: 20px;
        }
      `}</style>
    </section>
  )
}

function Resources () {
  return (
    <section id="resources">
      <h1>Resources</h1>
      <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
      <style jsx>{`
        section {
          margin-bottom: 20px;
          padding-top: 20px;
        }
      `}</style>
    </section>
  )
}

function Footer () {
  return (
    <footer>
      <p>
        Source code and CHANGELOG available on GitHub.
      </p>
      <style jsx>{`
        footer {
          padding: 50px;
          text-align: center;
        }
      `}</style>
    </footer>
  )
}

export default Index;
