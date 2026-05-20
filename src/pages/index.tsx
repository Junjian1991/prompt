import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🎬</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">提示词工厂</span>
          </div>
          
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/builder"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  进入工具
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 首屏 Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI短剧提示词，<br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              一键生成
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            从角色、场景、道具到合成、视频，五个模板覆盖全流程，<br className="hidden md:block" />
            让AI听得懂你的创意
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link
                href="/builder"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                进入工具
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                免费注册使用
              </Link>
            )}
            <a
              href="#templates"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-200"
            >
              了解模板
            </a>
          </div>
        </div>
      </section>

      {/* 五大模板介绍卡片区 */}
      <section id="templates" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">五大核心模板</h2>
            <p className="text-xl text-gray-600">覆盖AI短剧创作全流程</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* T1 人物/生物生成 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">T1 人物/生物生成</h3>
              <p className="text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">谁</span>，长什么样，<br />
                <span className="font-semibold text-gray-800">穿什么</span>，什么气质<br />
                <span className="font-semibold text-gray-800">三视图</span>，完整角色设定
              </p>
            </div>

            {/* T2 场景生成 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🌆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">T2 场景生成</h3>
              <p className="text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">在哪</span>，什么光<br />
                <span className="font-semibold text-gray-800">什么天气</span>，什么时间<br />
                <span className="font-semibold text-gray-800">镜头</span>，什么景别
              </p>
            </div>

            {/* T3 道具生成 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">T3 道具生成</h3>
              <p className="text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">什么东西</span><br />
                <span className="font-semibold text-gray-800">什么材质</span>，什么颜色<br />
                <span className="font-semibold text-gray-800">三视图</span>，完整道具设定
              </p>
            </div>

            {/* T4 主体+场景合成 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">T4 主体+场景合成</h3>
              <p className="text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">谁</span>在<span className="font-semibold text-gray-800">哪</span><br />
                <span className="font-semibold text-gray-800">动作</span>+<span className="font-semibold text-gray-800">表情</span>+<span className="font-semibold text-gray-800">情绪</span><br />
                完美融合角色与场景
              </p>
            </div>

            {/* T5 图生视频 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100 md:col-span-2 lg:col-span-2">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">T5 图生视频</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                让<span className="font-semibold text-gray-800">静态图</span>动起来<br />
                <span className="font-semibold text-gray-800">动态描述</span>+<span className="font-semibold text-gray-800">运动幅度</span>+<span className="font-semibold text-gray-800">运镜方式</span>
              </p>
              <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-blue-700 font-medium">支持多镜头编辑</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心特性区 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">核心特性</h2>
            <p className="text-xl text-gray-600">专为AI短剧创作者打造</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 海量预设选项 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">海量预设选项</h3>
                <p className="text-gray-600">覆盖主流到小众的各类选项，细分到每个创作细节</p>
              </div>
            </div>

            {/* 实时预览 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">实时预览</h3>
                <p className="text-gray-600">选择即更新，所见即所得，告别盲选</p>
              </div>
            </div>

            {/* 一键复制 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">一键复制</h3>
                <p className="text-gray-600">支持完整版、纯文本、英文版三种格式复制</p>
              </div>
            </div>

            {/* 中英文双语 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">中英文双语</h3>
                <p className="text-gray-600">标签、选项、输出全面支持中英文切换</p>
              </div>
            </div>

            {/* 冲突检测 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">冲突检测</h3>
                <p className="text-gray-600">智能检测选项冲突，避免生成无效提示词</p>
              </div>
            </div>

            {/* 完全免费 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">完全免费</h3>
                <p className="text-gray-600">注册即可使用全部功能</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">准备好开始创作了吗？</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            告别繁琐的手动编写，让AI更懂你的创意
          </p>
          {session ? (
            <Link
              href="/builder"
              className="inline-block bg-white text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1"
            >
              进入工具
            </Link>
          ) : (
            <Link
              href="/auth/register"
              className="inline-block bg-white text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1"
            >
              立即注册
            </Link>
          )}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🎬</span>
              </div>
              <span className="text-xl font-bold">提示词工厂</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>© 2024 提示词工厂. 保留所有权利.</p>
              <p className="text-sm mt-1">ICP备案号：XXXXXX</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
