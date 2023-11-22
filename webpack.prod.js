const path = require('path')
const prettier = require('prettier')
const { RetryChunkLoadPlugin } = require('webpack-retry-chunk-load-plugin')
const {
  container: { ModuleFederationPlugin },
  DefinePlugin
} = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const { GenerateStringTypesPlugin } = require('@harness/uicore/tools/GenerateStringTypesPlugin')

const moduleFederationConfig = require('./moduleFederation.config')
const CONTEXT = process.cwd()

module.exports = {
  target: 'web',
  context: CONTEXT,
  stats: {
    modules: false,
    children: false
  },
  output: {
    publicPath: 'auto',
    path: path.resolve(CONTEXT, 'dist/'),
    pathinfo: false
  },
  entry: {
    [moduleFederationConfig.name]: './src/public-path'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.module\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: '@harness/css-types-loader',
            options: {
              prettierConfig: CONTEXT
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'local',
                localIdentName: 'idpadmin[local]_[hash:base64:6]',
                exportLocalsConvention: 'camelCaseOnly'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.join(CONTEXT, 'src')]
              },
              sourceMap: false,
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /(?<!\.module)\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.join(CONTEXT, 'src')]
              },
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: [
          {
            loader: 'yaml-loader'
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        type: 'asset'
      }
    ]
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.json'],
    plugins: [new TsconfigPathsPlugin()]
  },
  plugins: [
    new ModuleFederationPlugin(moduleFederationConfig),
    new DefinePlugin({
      'process.env': '{}' // required for @blueprintjs/core
    }),
    new RetryChunkLoadPlugin({
      maxRetries: 3
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true
    }),
    new GenerateStringTypesPlugin({
      input: 'src/strings/strings.en.yaml',
      output: 'src/strings/types.ts',
      partialType: true,
      preProcess: async content => {
        const prettierConfig = await prettier.resolveConfig(process.cwd())

        return prettier.format(content, { ...prettierConfig, parser: 'typescript' })
      }
    })
  ]
}
